import { Module } from '@nestjs/common';
import { VictoriesController } from './victories.controller';
import { VictoriesService } from './victories.service';

@Module({
  controllers: [VictoriesController],
  providers: [VictoriesService],
})
export class VictoriesModule {}
