// src/vlsm/vlsm.service.ts
import { Injectable } from '@nestjs/common';
import * as ip from 'ip';

@Injectable()
export class VlsmService {
  private getSubnetMask(hosts: number) {
    let bitsNeeded = Math.ceil(Math.log2(hosts + 2));
    return 32 - bitsNeeded;
  }

  calculateSubnets(network: string, mask: number, hosts: number[]) {
    // Ordenar de mayor a menor la cantidad de hosts necesarios
    hosts.sort((a, b) => b - a);

    let subnets: {
      subnet: string;
      netmask: string;
      range: string;
      router: string;
      dns: string;
    }[] = [];
    let currentNetwork = network;

    for (const host of hosts) {
      let newMask = this.getSubnetMask(host);
      let subnetInfo = {
        subnet: currentNetwork,
        netmask: ip.subnet(currentNetwork, newMask.toString()).subnetMask,
        range: this.getRange(currentNetwork, newMask),
        router: ip.subnet(currentNetwork, newMask.toString()).firstAddress,
        dns: '8.8.8.8, 8.8.4.4',
      };

      subnets.push(subnetInfo);

      // Calcular la siguiente subred
      currentNetwork = this.calculateNextSubnet(currentNetwork, newMask);
    }

    return subnets;
  }

  private calculateNextSubnet(network: string, mask: number) {
    const subnetInfo = ip.subnet(network, mask.toString());
    const nextSubnetBase =
      ip.toLong(subnetInfo.networkAddress) + Math.pow(2, 32 - mask);
    return ip.fromLong(nextSubnetBase);
  }

  private getRange(network: string, mask: number) {
    let subnetInfo = ip.subnet(network, mask.toString());
    return `${subnetInfo.firstAddress} - ${subnetInfo.lastAddress}`;
  }
}
