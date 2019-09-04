import { NotFoundException } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NewWorkerInput } from './dto/new-worker.input';
import { WorkerData } from './models/worker';
import { WorkerService } from './worker.service';
import { WorkerEntity } from './worker.entity';

/**
 * Резолвер для graphql для работы с сотрудником
 */
@Resolver(of => WorkerData)
export class WorkersResolver {
	constructor(private readonly workerService: WorkerService) {
	}

	/**
	 * Поиск одного сотрудника
	 * @param {number} id идентификатор сотрудника
	 */
	@Query(returns => WorkerData)
	async worker(@Args('id') id: number): Promise<WorkerEntity> {
		const worker = await this.workerService.findOne(id);
		if (!worker) {
			throw new NotFoundException(id);
		}

		return worker;
	}

	/**
	 * Поиск всех сотрудников
	 */
	@Query(returns => [WorkerData])
	async workers(): Promise<WorkerEntity[]> {
		const workers = await this.workerService.findAll();
		if (!workers) {
			throw new NotFoundException();
		}

		return workers;
	}

	/**
	 * Добавление нового сотрудника
	 * @param {NewWorkerInput} newWorkerInput данные для добавления
	 */
	@Mutation(returns => WorkerData)
	async addWorker(
		@Args('newWorker') newWorkerInput: NewWorkerInput,
	): Promise<WorkerEntity> {
		return await this.workerService.create(newWorkerInput);
	}

	/**
	 * Обновление данных сотрудника
	 * @param {number} id идентификатор сотрудника
	 * @param {NewWorkerInput} updateWorker данные для добавления
	 */
	@Mutation(returns => WorkerData)
	async updateWorker(
		@Args('id') id: number,
		@Args('updateWorker') updateWorker: NewWorkerInput,
	): Promise<WorkerEntity> {
		const worker = await this.workerService.update(id, updateWorker);

		return worker;
	}

	/**
	 * Удаление сотрудника
	 * @param {number} id идентификатор сотрудника
	 */
	@Mutation(returns => Boolean)
	async removeWorker(@Args('id') id: number) {
		const result = await this.workerService.delete(id);
		const isRemove = result.affected === 1;

		return isRemove;
	}
}
