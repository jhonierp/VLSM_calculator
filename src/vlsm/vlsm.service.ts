import { Injectable } from '@nestjs/common';
import { VlsmDto } from './vlsm.dto';
import * as ip from 'ip';
import { NodeSSH } from 'node-ssh';

@Injectable()
export class VlsmService {
  calculateSubnets({ network, subnets, hosts }: VlsmDto) {
    const sortedHosts = hosts.sort((a, b) => b - a); // Ordenar de mayor a menor
    const results: Array<{
      subnet: string;
      netmask: string;
      firstHost: string;
      lastHost: string;
      broadcast: string;
      range: string;
      router: string;
      dns: string[];
    }> = [];
    let currentNetwork = ip.toLong(network);

    for (const host of sortedHosts) {
      const requiredBits = Math.ceil(Math.log2(host + 2)); // +2 por dirección de red y broadcast
      const newMask = 32 - requiredBits;
      const netmask = ip.subnet(network, ip.fromPrefixLen(newMask)).subnetMask;
      const broadcast = ip.fromLong(
        currentNetwork + Math.pow(2, requiredBits) - 1,
      );
      const firstHost = ip.fromLong(currentNetwork + 1);
      const lastHost = ip.fromLong(
        currentNetwork + Math.pow(2, requiredBits) - 2,
      );

      results.push({
        subnet: ip.fromLong(currentNetwork),
        netmask,
        firstHost,
        lastHost,
        broadcast,
        range: `${firstHost} ${lastHost}`,
        router: ip.fromLong(currentNetwork + 1),
        dns: ['8.8.8.8', '8.8.4.4'],
      });

      currentNetwork += Math.pow(2, requiredBits); // Mover a la siguiente subred
    }

    return results
      .map(
        (subnet) =>
          `subnet ${subnet.subnet} netmask ${subnet.netmask} {\n  range ${subnet.range};\n  option routers ${subnet.router};\n  option domain-name-servers ${subnet.dns.join(', ')};\n}`,
      )
      .join('\n\n');
  }

  calculateSubnetsJson({ network, subnets, hosts }: VlsmDto) {
    const sortedHosts = hosts.sort((a, b) => b - a);
    const results: Array<{
      subnet: string;
      netmask: string;
      hosts: number;
      firstHost: string;
      lastHost: string;
      broadcast: string;
    }> = [];
    let currentNetwork = ip.toLong(network);

    for (const host of sortedHosts) {
      const requiredBits = Math.ceil(Math.log2(host + 2)); // +2 por red y broadcast
      const newMask = 32 - requiredBits;
      const netmask = ip.subnet(network, ip.fromPrefixLen(newMask)).subnetMask;
      const broadcast = ip.fromLong(
        currentNetwork + Math.pow(2, requiredBits) - 1,
      );
      const firstHost = ip.fromLong(currentNetwork + 1);
      const lastHost = ip.fromLong(
        currentNetwork + Math.pow(2, requiredBits) - 2,
      );

      results.push({
        subnet: ip.fromLong(currentNetwork),
        netmask,
        hosts: host, // Agregamos la cantidad de hosts solicitados
        firstHost,
        lastHost,
        broadcast,
      });

      currentNetwork += Math.pow(2, requiredBits);
    }

    return { subnets: results };
  }

  // Obtener máscara de subred desde un prefijo CIDR
  getSubnetMask(prefix: number) {
    if (prefix < 0 || prefix > 32) {
      throw new Error('El prefijo debe estar entre 0 y 32.');
    }
    return {
      prefix,
      subnetMask: ip.fromPrefixLen(prefix),
    };
  }

  // Obtener información de una IP
  getIpInfo(ipAddress: string) {
    if (!ip.isV4Format(ipAddress)) {
      throw new Error('La dirección IP no es válida.');
    }

    const subnet = ip.subnet(ipAddress, '255.255.255.0');
    const ipClass = this.getIpClass(ipAddress);

    return {
      ip: ipAddress,
      network: subnet.networkAddress,
      subnetMask: subnet.subnetMask,
      class: ipClass,
      broadcast: subnet.broadcastAddress,
    };
  }

  // Determinar la clase de una IP (A, B, C, D, E)
  private getIpClass(ipAddress: string): string {
    const firstOctet = parseInt(ipAddress.split('.')[0], 10);

    if (firstOctet >= 1 && firstOctet <= 126) return 'A';
    if (firstOctet >= 128 && firstOctet <= 191) return 'B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'D';
    if (firstOctet >= 240 && firstOctet <= 255) return 'E';
    return 'Desconocida';
  }

  // Conexión SSH a un servidor remoto
}
