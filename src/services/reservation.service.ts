import { inject, injectable } from "inversify";
import { DI } from "../di/symbols";
import { IReservationRepository } from "../repositories/reservation.repository";
import { ReservationDto } from "../v1/dtos/reservation.dto";

export interface IReservationService {
  getAllReservations(): Promise<ReservationDto[]>
}

@injectable()
export class ReservationService implements IReservationService {
  @inject(DI.Repositories.ReservationRepository) private reservationRepository: IReservationRepository

  public async getAllReservations(): Promise<ReservationDto[]> {
    return (await this.reservationRepository.findAll()).map(reservation => ReservationDto.from(reservation))
  }

}