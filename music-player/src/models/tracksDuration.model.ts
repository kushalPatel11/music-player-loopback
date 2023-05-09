import { Model, model, property} from '@loopback/repository';

@model()
export class TracksDuration extends Model {
  @property({
    type: 'number',
    required: true,
  })
  minutes: number;

  @property({
    type: 'number',
    required: true,
  })
  seconds: number;


  constructor(data?: Partial<TracksDuration>) {
    super(data);
  }
}

export interface TracksDurationRelations {
  // describe navigational properties here
}

export type TracksDurationWithRelations = TracksDuration & TracksDurationRelations;
