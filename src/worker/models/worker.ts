import { Field, ID, ObjectType } from 'type-graphql';

/**
 * Модель для представления данных сотрудника в graphql
 */
@ObjectType()
export class WorkerData {
	@Field(type => ID)
	id: number;

	@Field()
	name: string;

	@Field()
	surName: string;

	@Field({ nullable: true })
	avatar?: string;
}
