export abstract class BaseDto {
  public static from(entity: any): BaseDto {
    throw new Error('Unimplemented DTO mapper.')
  }
}