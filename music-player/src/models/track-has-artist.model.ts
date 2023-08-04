import {Entity, belongsTo, model, property} from '@loopback/repository';
import {DateTime} from 'luxon';
import {Tracks} from './tracks.model';
import {Users} from './users.model';

@model()
export class TrackHasArtist extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(
    () => Users,
    {
      name: 'users',
    },
    {
      type: 'string',
      required: true,
      mongodb: {dataType: 'ObjectId'},
    },
  )
  artistId: string;

  @belongsTo(
    () => Tracks,
    {
      name: 'tracks',
    },
    {
      type: 'string',
      required: true,
      mongodb: {dataType: 'ObjectId'},
    },
  )
  tracksId: string;

  @property({
    type: 'string',
    required: false,
    default: null,
  })
  collaborationToken: string;

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      enum: ['pending', 'accepted', 'rejected'],
      errormessage: {
        pattern: `Choose from pending, accepted, rejected only!!`,
      },
    },
    default: 'pending',
  })
  collaborationStatus: string;

  @property({
    type: 'date',
    required: true,
    default: DateTime.utc().toJSDate(),
  })
  createdAt: DateTime;

  @property({
    type: 'date',
    required: true,
    default: DateTime.utc().toJSDate(),
  })
  updatedAt: DateTime;

  constructor(data?: Partial<TrackHasArtist>) {
    super(data);
  }
}

export interface TrackHasArtistRelations {
  // describe navigational properties here
}

export type TrackHasArtistWithRelations = TrackHasArtist &
  TrackHasArtistRelations;
