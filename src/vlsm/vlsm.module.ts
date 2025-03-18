import { Module } from '@nestjs/common';
import { VlsmService } from './vlsm.service';
import { VlsmController } from './vlsm.controller';

@Module({
  providers: [VlsmService], // Se declara el servicio como provider
  controllers: [VlsmController],
  exports: [VlsmService], // Se exporta el servicio para que otros módulos lo puedan usar
})
export class VlsmModule {}
