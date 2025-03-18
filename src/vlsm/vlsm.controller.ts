import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
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
}
