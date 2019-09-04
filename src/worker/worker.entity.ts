import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';

@Entity()
export class WorkerEntity {
	@PrimaryGeneratedColumn()
	@ApiModelProperty()
	id: number;

	@Column({ length: 500 })
	@ApiModelProperty()
	name: string;

	@Column({ length: 500 })
	@ApiModelProperty()
	surName: string;

	@Column({
		length: 500,
		nullable: true,
	})
	@ApiModelProperty()
	avatar: string;
}
