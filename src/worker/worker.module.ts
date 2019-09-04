import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkerService } from './worker.service';
import { WorkersResolver } from './worker.resolver';
import { WorkerEntity } from './worker.entity';

@Module({
	imports: [TypeOrmModule.forFeature([WorkerEntity])],
	providers: [WorkerService, WorkersResolver],
})
export class WorkerModule {}
