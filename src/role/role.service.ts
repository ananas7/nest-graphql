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
	) {
	}

	/**
	 * Создания дерева ролей
	 * @param {number} level уровень до которого строить дерево
	 * @param {number|null} parentId идентификатор родительской роли
	 */
	async makeTree({ level, parentId = null }: RoleArgs): Promise<RoleDataTree[]> {
		if (level === 0) {
			return [];
		}
		const hasNotLevel = level === null;
		const leftLevel = hasNotLevel ? level : --level;

		const entities = await this.roleRepository.find({
			where: {
				parent: parentId,
			},
			relations: ['worker'],
		});
		const res: RoleDataTree[] = [];

		for (const entity of entities) {
			const { parent, ...entityData } = entity;
			const allChildrenCount = await this.countAllDescendants(entity.id);
			const childrenCount = await this.countNativeDescendants(entity.id);
			const children = await this.makeTree({ level: leftLevel, parentId: entity.id });
			const newElem = {
				...entityData,
				children,
				allChildrenCount,
				childrenCount,
			};
			res.push(newElem);
		}

		return res;
	}

	/**
	 * Метод для поиска "родных" детей узла
	 * @param id идентификатор родительской роли
	 */
	private async countNativeDescendants(id: number) {
		return await this.roleRepository
			.createQueryBuilder('role')
			.where('role.parent = :id', { id })
			.getCount();
	}

	/**
	 * Метод для поиска всех детей узла
	 * @param id идентификатор родительской роли
	 */
	private async countAllDescendants(id: number) {
		let count = 0;
		const children = await this.roleRepository.find({ where: { parent: id } });

		if (!children) {
			return count;
		}

		// Добавляем количество прямых потомков
		count += children.length;

		// Добавляем количество детей детей
		for (const child of children) {
			count += await this.countAllDescendants(child.id);
		}

		return count;
	}

	/**
	 * Метод для поиска одной роли
	 */
	async findOne(id: number): Promise<RoleEntity> {
		return await this.getAndCheckRole(id);
	}

	/**
	 * Метод для создания новой роли
	 */
	async create(articleData: NewRoleInput): Promise<RoleEntity> {
		const role = new RoleEntity();
		role.name = articleData.name;
		role.direction = articleData.direction;
		if (articleData.parentId) {
			role.parent = await this.getAndCheckRole(articleData.parentId);
		}

		return await this.roleRepository.save(role);

	}

	/**
	 * Метод для обновления данных роли
	 */
	async update(roleId: number, { parent, worker, ...roleData }: UpdateRoleInput): Promise<RoleEntity> {
		const toUpdate = await this.getAndCheckRole(roleId);
		const updated = Object.assign(toUpdate, roleData);
		if (parent) {
			updated.parent = await this.getAndCheckRole(parent);
		}
		if (worker) {
			updated.worker = await this.getAndCheckWorker(worker);
		}

		return await this.roleRepository.save(updated);
	}

	/**
	 * Метод для удаления роли
	 */
	async delete(roleId: number): Promise<DeleteResult> {
		return await this.roleRepository.delete({ id: roleId });
	}

	/**
	 * Метод для добавления роли сотрудника
	 */
	async linkWorkerToRole(roleId: number, workerId: number) {
		const worker = await this.getAndCheckWorker(workerId);
		const role = await this.getAndCheckRole(roleId);

		role.worker = worker;

		return await this.roleRepository.save(role);
	}

	/**
	 * Находит роль по id, если нет создаёт ошибку
	 * @param id
	 */
	private async getAndCheckRole(id: number) {
		const role = await this.roleRepository.findOne(id);
		if (!role) {
			throw new NotFoundException(id);
		}

		return role;
	}

	/**
	 * Находит сотрудника по id, если нет создаёт ошибку
	 * @param id
	 */
	private async getAndCheckWorker(id: number) {
		const worker = await this.workerRepository.findOne(id);
		if (!worker) {
			throw new NotFoundException(id);
		}

		return worker;
	}
}
