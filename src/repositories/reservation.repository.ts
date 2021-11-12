import {injectable} from 'inversify'
import {IBaseRepository} from './base.repository'
import { getConnection, Repository } from 'typeorm'
import { Reservation } from '../models/entities/reservation'

export interface IReservationRepository extends IBaseRepository<Reservation> { }

@injectable()
export class ReservationRepository implements IReservationRepository {

  private repository: Repository<Reservation>

  constructor() {
    this.repository = getConnection().getRepository(Reservation)
  }

  findById(id: number): Promise<Reservation | undefined> {
    throw new Error('Method not implemented.')
  }
  add(o: Reservation): Promise<Reservation> {
    throw new Error('Method not implemented.')
  }
  update(o: Reservation): Promise<Reservation> {
    throw new Error('Method not implemented.')
  }
  remove(o: Reservation): Promise<Reservation> {
    throw new Error('Method not implemented.')
  }
  findAll(): Promise<Reservation[]> {
    throw new Error('Method not implemented.')
  }
  exists(conditions: any): Promise<boolean> {
    throw new Error('Method not implemented.')
  }
}
