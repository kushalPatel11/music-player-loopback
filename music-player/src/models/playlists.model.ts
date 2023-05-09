import {Entity, belongsTo, model, property} from '@loopback/repository';
import { Users } from './users.model';
import { DateTime } from 'luxon';
import { LinkObject } from '@loopback/rest';

@model()
export class Playlists extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
  })
  name: string;

  @property({
    type: 'string',
    required: false,
  })
  description?: string;

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      format: "url",
      errorMessage: {
        pattern: `Invalid url`,
      }, 
    }
  })
  logo: string;

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
  CreatedBy : string;

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
  updatedBy : string;

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

  constructor(data?: Partial<Playlists>) {
    super(data);
  }
}

export interface PlaylistsRelations {
  // describe navigational properties here
  createdByUser?: Users;
}

export type PlaylistsWithRelations = Playlists & PlaylistsRelations;
