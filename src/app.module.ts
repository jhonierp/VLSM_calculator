import { Module } from '@nestjs/common';

import { VlsmModule } from './vlsm/vlsm.module';
import { VlsmController } from './vlsm/vlsm.controller';
import { VlsmService } from './vlsm/vlsm.service';

@Module({
  imports: [VlsmModule],
  controllers: [VlsmController],
  providers: [VlsmService],
})
export class AppModule {}
