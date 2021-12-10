import { BaseDto } from '../../models/base.dto'
import { Reservation } from '../../models/entities/reservation'
import { Discipline } from '../../services/nordkraft.service'

export class ReservationDto extends BaseDto {

  uuid: string
  discipline: Discipline
  location: string
  date: string
  time: string

  static from(entity: Reservation): ReservationDto {
    const o = new ReservationDto()
    o.uuid = entity.uuid
    o.location = entity.location
    o.discipline = entity.discipline

    return o
  }
}