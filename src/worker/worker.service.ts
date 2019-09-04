import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { WorkerEntity } from './worker.entity';
import { WorkerData } from './models/worker';
import { NewWorkerInput } from './dto/new-worker.input';

/**
 * Сервис для работы с сотрудником
 */
@Injectable()
export class WorkerService {
	constructor(
		@InjectRepository(WorkerEntity)
		private readonly workerRepository: Repository<WorkerEntity>,
	) {}

	/**
	 * Метод для поиска всех сотрудников
	 */
	findAll(): Promise<WorkerEntity[]> {
		return this.workerRepository.find();
	}

	/**
	 * Метод для поиска одного сотрудника
	 */
	findOne(id: number): Promise<WorkerEntity> {
		return this.workerRepository.findOne(id);
	}

	/**
	 * Метод для создания нового сотрудника
	 */
	async create(workerData: NewWorkerInput): Promise<WorkerEntity> {

		const workerEntity = new WorkerEntity();
		workerEntity.name = workerData.name;
		workerEntity.surName = workerData.surName;

		return await this.workerRepository.save(workerEntity);

	}

	/**
	 * Метод для обновления данных сотрудника
	 */
	async update(workerId: number, workerData: Partial<WorkerData>): Promise<WorkerEntity> {
		const toUpdate = await this.workerRepository.findOne({ id: workerId});
		const updated = Object.assign(toUpdate, workerData);

		return await this.workerRepository.save(updated);
	}

	/**
	 * Метод для удаления сотрудника
	 */
	async delete(workerId: number): Promise<DeleteResult> {
		return await this.workerRepository.delete({ id: workerId });
	}
}
