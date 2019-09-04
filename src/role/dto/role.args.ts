import { IsOptional, Max, Min } from 'class-validator';
import { ArgsType, Field, Int } from 'type-graphql';

@ArgsType()
export class RoleArgs {
	@Field(type => Int, { nullable: true })
	@IsOptional()
	@Min(0)
	@Max(50)
	level: number = null;

	@Field(type => Int, { nullable: true })
	parentId: number;
}
