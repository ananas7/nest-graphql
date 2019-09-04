import { IsOptional, MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

/**
 * Данные для обновления роли
 */
@InputType()
export class UpdateRoleInput {
	@Field()
	@IsOptional()
	@MaxLength(500)
	name?: string;

	@Field()
	@IsOptional()
	@MaxLength(500)
	direction?: string;

	@Field({ nullable: true})
	@IsOptional()
	parent?: number;

	@Field({ nullable: true})
	worker?: number;
}
