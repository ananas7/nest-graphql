import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { RoleEntity } from './role.entity';
import { NewRoleInput } from './dto/new-role.input';
import { WorkerEntity } from '../worker/worker.entity';
import { UpdateRoleInput } from './dto/update-role.input';
import { RoleDataTree } from './models/role-tree';
import { RoleArgs } from './dto/role.args';

/**
 * Сервис для работы с ролями
 */
@Injectable()
export class RoleService {
	constructor(
		@InjectRepository(RoleEntity)
		private readonly roleRepository: Repository<RoleEntity>,
		@InjectRepository(WorkerEntity)
		private readonly workerRepository: Repository<WorkerEntity>,
	) {}

	/**
	 * Метод для поиска всех ролей
	 */
	async findAll({level = 3, parentId = null}: RoleArgs): Promise<RoleDataTree[]> {
		return await this.makeTree(level, parentId);
	}

	/**
	 * Создания дерева ролей
	 * @param {number} level уровень до которого строить дерево
	 * @param {number|null} parentId идентификатор родительской роли
	 */
	async makeTree(level: number, parentId: number | null): Promise<RoleDataTree[]> {
		if (level === 0) {
			return [];
		}
		const newLevel = --level;

		const entities = await this.roleRepository.find({
			where: {
				parent: parentId,
			},
			relations: ['worker'],
		});
		const res: RoleDataTree[] = [];

		for (const entity of entities) {
			const {parent, ...entityData} = entity;
			const newElem = {
				...entityData,
				children: await this.makeTree(newLevel, entity.id),
			};
			res.push(newElem);
		}

		return res;
	}

	/**
	 * Метод для поиска одной роли
	 */
	async findOne(id: number): Promise<RoleEntity> {
		return await this.roleRepository.findOne(id);
	}

	/**
	 * Метод для создания новой роли
	 */
	async create(articleData: NewRoleInput): Promise<RoleEntity> {
		const role = new RoleEntity();
		role.name = articleData.name;
		role.direction = articleData.direction;
		if (articleData.parentId) {
			const parentRole = await this.roleRepository.findOne(articleData.parentId);
			if (!parentRole) {
				throw new NotFoundException(articleData.parentId);
			}
			role.parent = parentRole;
		}

		return await this.roleRepository.save(role);

	}

	/**
	 * Метод для обновления данных роли
	 */
	async update(roleId: number, {parent, worker, ...roleData}: UpdateRoleInput): Promise<RoleEntity> {
		const toUpdate = await this.roleRepository.findOne({ id: roleId});
		const updated = Object.assign(toUpdate, roleData);
		if (parent) {
			const parentRole = await this.roleRepository.findOne(parent);
			if (!parentRole) {
				throw new NotFoundException(parent);
			}
			updated.parent = parentRole;
		}
		if (worker) {
			const workerEntity = await this.workerRepository.findOne(worker);
			if (!workerEntity) {
				throw new NotFoundException(worker);
			}
			updated.worker = workerEntity;
		}

		return await this.roleRepository.save(updated);
	}

	/**
	 * Метод для удаления роли
	 */
	async delete(roleId: number): Promise<DeleteResult> {
		return await this.roleRepository.delete({ id: roleId});
	}

	/**
	 * Метод для добавления роли сотрудника
	 */
	async linkWorkerToRole(roleId: number, workerId: number) {
		const worker = await this.workerRepository.findOne(workerId);
		const role = await this.roleRepository.findOne(roleId);

		role.worker = worker;

		return await this.roleRepository.save(role);
	}
}