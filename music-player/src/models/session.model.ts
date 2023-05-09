import {Entity, model, property, belongsTo} from '@loopback/repository';
import { DateTime } from 'luxon';
import { Users } from './users.model';

@model()
export class Session extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(
    () =>Users,
    {
      name : 'users',
    },
    {
      type : 'string',
      required: true,
      mongodb: {dataType : 'ObjectId'},
    },
  )
  userId : string;

  @property({
    type: 'string',
    required: true,
  })
  jwt: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['current', 'expired'],
    },
    default: 'current'
  })
  status: string;

  @property({
    type: 'date',
    required: true,
    // default: () => DateTime.utc().toISO(),
  })
  loginAt: Date;

  @property({
    type: 'date',
    required: true,
  })
  expireAt: Date;

  @property({
    type: 'date',
    default: null,
  })
  expiredAt?: DateTime;

  @property({
    type: 'date',
    required: true,
    default: () => DateTime.utc().toJSDate(),
  })
  createdAt: DateTime;

  @property({
    type: 'date',
    required: true,
    default: () => DateTime.utc().toJSDate(),
  })
  updatedAt: DateTime;


  constructor(data?: Partial<Session>) {
    super(data);
  }
}

export interface SessionRelations {
  // describe naviational properties here
}

export type SessionWithRelations = Session & SessionRelations;
