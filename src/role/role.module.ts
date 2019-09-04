import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { RoleEntity } from './role.entity';
import { RolesResolver } from './role.resolver';
import { WorkerModule } from '../worker/worker.module';
import { WorkerEntity } from '../worker/worker.entity';

@Module({
	imports: [TypeOrmModule.forFeature([RoleEntity, WorkerEntity]), WorkerModule],
	providers: [RoleService, RolesResolver],
})
export class RoleModule {}
