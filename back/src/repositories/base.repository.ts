import { FindConditions, FindManyOptions } from "typeorm";

export interface IBaseRepository<T> {
  findById(id: number): Promise<T | undefined>
  add(o: T): Promise<T>
  update(o: T): Promise<T>
  remove(o: T): Promise<T>
  findAll(): Promise<T[]>
  exists(conditions: FindConditions<T>): Promise<boolean>
}