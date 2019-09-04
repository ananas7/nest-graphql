import {
	Entity,
	Column,
	PrimaryGeneratedColumn,
	JoinTable,
	ManyToOne,
} from 'typeorm';
import { WorkerEntity } from '../worker/worker.entity';

@Entity()
export class RoleEntity {
	@PrimaryGeneratedColumn()
	id: number;

	@Column({ length: 500 })
	name: string;

	@Column({ length: 500 })
	direction: string;

	@Column({ nullable: true })
	workerId: number;

	@ManyToOne(type => WorkerEntity, { eager: true, nullable: true })
	@JoinTable()
	worker: WorkerEntity;

	@ManyToOne(type => RoleEntity, { nullable: true })
	@JoinTable()
	parent: RoleEntity;
}
