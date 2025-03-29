import { Injectable } from '@nestjs/common';
import { VlsmDto } from './vlsm.dto';
import * as ip from 'ip';

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
      firstHost: string;
      lastHost: string;
      broadcast: string;
      range: { start: string; end: string };
      router: string;
      dns: string[];
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
        firstHost,
        lastHost,
        broadcast,
        range: { start: firstHost, end: lastHost },
        router: ip.fromLong(currentNetwork + 1),
        dns: ['8.8.8.8', '8.8.4.4'],
      });

      currentNetwork += Math.pow(2, requiredBits);
    }

    return { subnets: results };
  }
}
