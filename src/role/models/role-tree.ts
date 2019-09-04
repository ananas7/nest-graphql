import { Field, ID, ObjectType } from 'type-graphql';
import { WorkerData } from '../../worker/models/worker';

/**
 * Модель для представления данных дерево ролей в graphql
 */
@ObjectType()
export class RoleDataTree {
	@Field(type => ID)
	id: number;

	@Field()
	name: string;

	@Field()
	direction: string;

	@Field(type => [RoleDataTree], { nullable: true })
	children: RoleDataTree[];

	@Field({ nullable: true })
	worker: WorkerData;
}
