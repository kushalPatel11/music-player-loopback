import {Entity, belongsTo, model, property} from '@loopback/repository';
import { Users } from './users.model';
import { Tracks } from './tracks.model';
import { DateTime } from 'luxon';

@model()
export class TrackHasArtist extends Entity {
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
  artistId: string;

  @belongsTo(
    () =>Tracks,
    {
      name : 'tracks',
    },
    {
      type : 'string',
      required: true,
      mongodb: {dataType : 'ObjectId'},
    },
  )
  tracksId: string;

  @property({
    type: 'date',
    required: true,
    default: DateTime.utc().toJSDate()
  })
  createdAt: DateTime;

  @property({
    type: 'date',
    required: true,
    default: DateTime.utc().toJSDate()
  })
  updatedAt: DateTime;

  constructor(data?: Partial<TrackHasArtist>) {
    super(data);
  }
}

export interface TrackHasArtistRelations {
  // describe navigational properties here
}

export type TrackHasArtistWithRelations = TrackHasArtist & TrackHasArtistRelations;
