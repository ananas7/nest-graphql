import { WorkerEntity } from '../worker.entity';
import { oneWorker } from './oneWorker';

const oneWorkerEntity = new WorkerEntity();

oneWorkerEntity.name = oneWorker.name;
oneWorkerEntity.surName = oneWorker.surName;
oneWorkerEntity.avatar = oneWorker.avatar;

export {oneWorkerEntity};
