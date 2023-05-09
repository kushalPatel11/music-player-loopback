import {Model, model, property} from '@loopback/repository';

@model()
export class Ratings extends Model {
  @property({
    type: 'number',
    required: true,
  })
  likes: number;

  @property({
    type: 'number',
  })
  dislikes?: number;


  constructor(data?: Partial<Ratings>) {
    super(data);
  }
}

export interface RatingsRelations {
  // describe navigational properties here
}

export type RatingsWithRelations = Ratings & RatingsRelations;
