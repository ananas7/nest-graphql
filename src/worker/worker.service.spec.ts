import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { WorkerService } from './worker.service';
import { WorkerEntity } from './worker.entity';
import { Repository } from 'typeorm';
import { fewWorkers } from './mocks/fewWorkers';
import { oneWorker } from './mocks/oneWorker';
import { oneWorkerEntity } from './mocks/oneWorkerEntity';
import { NotFoundException } from '@nestjs/common';

describe('WorkerService', () => {
	let service: WorkerService;
	let repo: Repository<WorkerEntity>;

	beforeEach(async () => {
		const testingModule: TestingModule = await Test.createTestingModule({
			providers: [
				WorkerService,
				{
					provide: getRepositoryToken(WorkerEntity),
					useClass: Repository,
				},
			],
		}).compile();
		service = testingModule.get<WorkerService>(WorkerService);
		repo = testingModule.get<Repository<WorkerEntity>>(getRepositoryToken(WorkerEntity));
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	it('should get all worker', async () => {
		jest.spyOn(repo, 'find').mockResolvedValueOnce(fewWorkers);

		const workers = await service.findAll();
		expect(workers).toBe(fewWorkers);
	});

	it('should get one worker', async () => {
		const id = 2;
		jest.spyOn(repo, 'findOne').mockImplementation((workerId: any) => Promise.resolve(fewWorkers[workerId]));

		const workers = await service.findOne(id);
		expect(workers).toBe(fewWorkers[id]);
	});

	it('should get error on one worker find', async () => {
		const id = 2;
		jest.spyOn(repo, 'findOne').mockImplementation(() => Promise.resolve(null));

		try {
			await service.findOne(id);
		} catch (err) {
			expect(err instanceof NotFoundException).toEqual(true);
		}
	});

	it('should create worker', async () => {
		jest.spyOn(repo, 'findOne').mockResolvedValueOnce(Promise.resolve(oneWorkerEntity));
		jest.spyOn(repo, 'save').mockImplementation((value: WorkerEntity) => Promise.resolve(value));

		const worker = await service.create(oneWorker);
		expect(worker.avatar).toBe(oneWorkerEntity.avatar);
		expect(worker.name).toBe(oneWorkerEntity.name);
		expect(worker.surName).toBe(oneWorkerEntity.surName);
	});

	it('should update worker', async () => {
		jest.spyOn(repo, 'findOne').mockResolvedValueOnce(Promise.resolve(oneWorkerEntity));
		jest.spyOn(repo, 'save').mockImplementation((value: WorkerEntity) => Promise.resolve(value));

		const worker = await service.update(1, {name: 'NotDude'});
		expect(worker.avatar).toBe(oneWorkerEntity.avatar);
		expect(worker.name).toBe('NotDude');
		expect(worker.surName).toBe(oneWorkerEntity.surName);
		expect(worker.id).toBe(oneWorkerEntity.id);
	});

	it('should delete worker', async () => {
		const deleteResult = {affected: 1, raw: []};

		jest.spyOn(repo, 'delete').mockResolvedValueOnce(Promise.resolve(deleteResult));
		jest.spyOn(repo, 'save').mockImplementation((value: WorkerEntity) => Promise.resolve(value));

		expect(await service.delete(1)).toBe(deleteResult);
	});
});
