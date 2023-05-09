import {Model, model, property} from '@loopback/repository';
import { DateTime } from 'luxon';

@model()
export class ForgotPasswordData extends Model {
  @property({
    type: 'string',
    default: null,
  })
  token?: string;

  @property({
    type: 'string',
    default: null,
  })
  status?: string;

  @property({
    type: 'date',
    default: null,
  })
  createdAt?: DateTime | null;

  @property({
    type: 'date',
    default: null,
  })
  expireAt?: DateTime | null;

  @property({
    type: 'date',
    required: true,
    default: null,
  })
  expiredAt?: DateTime | null;


  constructor(data?: Partial<ForgotPasswordData>) {
    super(data);
  }
}

export interface ForgotPasswordDataRelations {
  // describe navigational properties here
}

export type ForgotPasswordDataWithRelations = ForgotPasswordData & ForgotPasswordDataRelations;
