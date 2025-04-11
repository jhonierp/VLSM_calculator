import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { VlsmService } from './vlsm.service';
import { VlsmDto } from './vlsm.dto';

@ApiTags('VLSM') // Categoriza en Swagger
@Controller('vlsm')
export class VlsmController {
  constructor(private readonly vlsmService: VlsmService) {}

  @Get('calculate')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiQuery({ name: 'network', type: String, example: '172.18.0.0' })
  @ApiQuery({ name: 'subnets', type: Number, example: 3 })
  @ApiQuery({
    name: 'hosts',
    type: [Number],
    example: [500, 200, 100],
    isArray: true,
  })
  calculateSubnets(@Query() params: VlsmDto) {
    return this.vlsmService.calculateSubnets(params);
  }

  @Get('calculate-json')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiQuery({ name: 'network', type: String, example: '172.18.0.0' })
  @ApiQuery({ name: 'subnets', type: Number, example: 3 })
  @ApiQuery({
    name: 'hosts',
    type: [Number],
    example: [500, 200, 100],
    isArray: true,
  })
  calculateSubnetsJson(@Query() params: VlsmDto) {
    return this.vlsmService.calculateSubnetsJson(params);
  }

  // Obtener la máscara de subred desde un prefijo CIDR
  @Get('subnet-mask/:prefix')
  @ApiParam({
    name: 'prefix',
    type: Number,
    example: 24,
    description: 'Prefijo CIDR',
  })
  getSubnetMask(@Param('prefix') prefix: number) {
    return this.vlsmService.getSubnetMask(Number(prefix));
  }

  // Obtener información de una IP
  @Get('ip-info')
  @ApiQuery({
    name: 'ip',
    type: String,
    example: '192.168.1.10',
    description: 'Dirección IP',
  })
  getIpInfo(@Query('ip') ipAddress: string) {
    return this.vlsmService.getIpInfo(ipAddress);
  }
}
