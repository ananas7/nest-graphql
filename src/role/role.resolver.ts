import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NewRoleInput } from './dto/new-role.input';
import { RoleData } from './models/role';
import { RoleService } from './role.service';
import { RoleEntity } from './role.entity';
import { UpdateRoleInput } from './dto/update-role.input';
import { RoleDataTree } from './models/role-tree';
import { RoleArgs } from './dto/role.args';

/**
 * Резолвер для graphql для работы с ролями
 */
@Resolver(of => RoleData)
export class RolesResolver {
	constructor(private readonly roleService: RoleService) {
	}

	/**
	 * Поиск одной роли
	 * @param {number} id идентификатор роли
	 */
	@Query(returns => RoleData)
	async role(@Args('id') id: number): Promise<RoleEntity> {
		const role = await this.roleService.findOne(id);
		if (!role) {
			throw new NotFoundException(id);
		}

		return role;
	}

	/**
	 * Получение дерева ролей с сотрудниками
	 * @param {RoleArgs} roleArgs аргументы для построения дерева
	 */
	@Query(returns => [RoleDataTree])
	roles(@Args() roleArgs: RoleArgs): Promise<RoleDataTree[]> {
		return this.roleService.makeTree(roleArgs);
	}

	/**
	 * Добавление новой роли
	 * @param {NewRoleInput} newRoleInput данные для новой роли
	 */
	@Mutation(returns => RoleData)
	async addRole(
		@Args('newRole') newRoleInput: NewRoleInput,
	): Promise<RoleEntity> {
		return await this.roleService.create(newRoleInput);
	}

	/**
	 * Обновление данных роли
	 * @param {number} id идентификатор роли
	 * @param {NewRoleInput} updateRole аргументы для построения дерева
	 */
	@Mutation(returns => RoleData)
	async updateRole(
		@Args('id') id: number,
		@Args('updateRole') updateRole: UpdateRoleInput,
	): Promise<RoleEntity> {
		return await this.roleService.update(id, updateRole);
	}

	/**
	 * Добавление сотрудника к роли
	 * @param {number} roleId идентификатор роли
	 * @param {number} workerId идентификатор сотрудника
	 */
	@Mutation(returns => RoleData)
	async addWorkerToRole(
		@Args('roleId') roleId: number,
		@Args('workerId') workerId: number,
	): Promise<RoleEntity> {
		return await this.roleService.linkWorkerToRole(roleId, workerId);
	}

	/**
	 * Удаление роли
	 * @param {number} id идентификатор роли
	 */
	@Mutation(returns => Boolean)
	async removeRole(@Args('id') id: number) {
		const result = await this.roleService.delete(id);
		const isRemove = result.affected === 1;

		return isRemove;
	}
}
