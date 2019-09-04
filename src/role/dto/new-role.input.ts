import { MaxLength } from 'class-validator';
import { Field, InputType } from 'type-graphql';

/**
 * Данные для создания новой роли
 */
@InputType()
export class NewRoleInput {
	@Field()
	@MaxLength(500)
	name: string;

	@Field()
	@MaxLength(500)
	direction: string;

	@Field({ nullable: true})
	parentId: number;
}
