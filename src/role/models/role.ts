import { Field, ID, ObjectType } from 'type-graphql';
import { WorkerData } from '../../worker/models/worker';

/**
 * Модель для представления данных роли в graphql
 */
@ObjectType()
export class RoleData {
	@Field(type => ID)
	id: number;

	@Field()
	name: string;

	@Field()
	direction: string;

	@Field({ nullable: true })
	parent: RoleData;

	@Field({ nullable: true })
	worker: WorkerData;
}
