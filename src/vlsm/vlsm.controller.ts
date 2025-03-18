import {
  Controller,
  Get,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { VlsmService } from './vlsm.service';
import { VlsmDto } from './vlsm.dto';
import { ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('VLSM')
@Controller('vlsm')
export class VlsmController {
  constructor(private readonly vlsmService: VlsmService) {}

  @Get('calculate')
  @UsePipes(new ValidationPipe({ transform: true }))
  calculateSubnets(
    @Query() params: VlsmDto, // Aplicamos el DTO
  ) {
    return this.vlsmService.calculateSubnets(
      params.network,
      params.mask,
      params.hosts,
    );
  }
}
