import {Entity, belongsTo, model, property} from '@loopback/repository';
import {DateTime} from 'luxon';
import {Playlists} from './playlists.model';
import {Users} from './users.model';

@model()
export class PlaylistHasUsers extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(
    () => Playlists,
    {
      name: 'playlists',
    },
    {
      type: 'string',
      required: true,
      mongodb: {dataType: 'ObjectId'},
    },
  )
  playlistId: string;

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
  userId: string;

  @property({
    type: 'string',
    required: true,
  })
  invitationToken: string;

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      enum: ['pending', 'accepted', 'rejected'],
      errorMessage: {
        pattern: `choose from pending, accepted or rejected only!`,
      },
    },
    default: 'pending',
  })
  status: string;

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

  constructor(data?: Partial<PlaylistHasUsers>) {
    super(data);
  }
}

export interface PlaylistHasUsersRelations {
  // describe navigational properties here
}

export type PlaylistHasUsersWithRelations = PlaylistHasUsers &
  PlaylistHasUsersRelations;
