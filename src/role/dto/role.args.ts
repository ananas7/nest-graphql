import { Max, Min } from 'class-validator';
import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class RoleArgs {
	@Field(type => Int)
	@Min(0)
	@Max(50)
	level: number = 0;

	@Field(type => Int, { nullable: true })
	parentId: number;
}
