import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkerModule } from './worker/worker.module';
import { RoleModule } from './role/role.module';

@Module({
	imports: [
		TypeOrmModule.forRoot(),
		WorkerModule,
		RoleModule,
		GraphQLModule.forRoot({
			installSubscriptionHandlers: true,
			autoSchemaFile: 'schema.gql',
		}),
	],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
