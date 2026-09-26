import { Module } from '@nestjs/common';
import { SensorsService } from './sensors.service';

@Module({
  providers: [SensorsService]
})
export class SensorsModule {}
