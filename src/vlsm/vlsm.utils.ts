export function calculateVLSM(network: string, hosts: number[]) {
  hosts.sort((a, b) => b - a); // Ordenamos de mayor a menor
  type Subnet = {
    subnet: string;
    netmask: string;
    hosts: number;
    range: string;
  };

  let subnets: Subnet[] = [];
  let baseIp = ipToBinary(network);

  let currentIp = baseIp;
  for (let hostsNeeded of hosts) {
    let bitsNeeded = Math.ceil(Math.log2(hostsNeeded + 2)); // +2 por dirección de red y broadcast
    let subnetMask = 32 - bitsNeeded;
    let subnetIp = binaryToIp(currentIp);

    subnets.push({
      subnet: subnetIp,
      netmask: cidrToMask(subnetMask),
      hosts: hostsNeeded,
      range: calculateRange(subnetIp, subnetMask),
    });

    currentIp = getNextSubnet(currentIp, bitsNeeded);
  }

  return subnets;
}

// 🔹 Funciones auxiliares
function ipToBinary(ip: string): string {
  return ip
    .split('.')
    .map((octet) => ('00000000' + parseInt(octet, 10).toString(2)).slice(-8))
    .join('');
}

function binaryToIp(binary: string): string {
  return (
    binary
      .match(/.{8}/g)
      ?.map((bin) => parseInt(bin, 2))
      .join('.') || ''
  );
}

function cidrToMask(cidr: number): string {
  return binaryToIp('1'.repeat(cidr).padEnd(32, '0'));
}

function calculateRange(network: string, mask: number) {
  let ipParts = network.split('.').map(Number);
  let subnetSize = Math.pow(2, 32 - mask);
  let startIp = ipParts.slice();
  startIp[3] += 1; // Primer IP usable

  let endIp = ipParts.slice();
  endIp[3] += subnetSize - 2; // Última IP usable

  return `${startIp.join('.')} - ${endIp.join('.')}`;
}

function getNextSubnet(currentIp: string, bitsNeeded: number): string {
  let newBinary = (parseInt(currentIp, 2) + Math.pow(2, bitsNeeded)).toString(
    2,
  );
  return ('0'.repeat(32) + newBinary).slice(-32);
}
