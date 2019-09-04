import { IsOptional, Length, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

/**
 * Данные для создания нового сотрудника
 */
@InputType()
export class NewWorkerInput {
	@Field()
	@MaxLength(500)
	name: string;

	@Field()
	@MaxLength(500)
	surName: string;

	@Field({ nullable: true })
	@IsOptional()
	@Length(500)
	avatar?: string;
}
