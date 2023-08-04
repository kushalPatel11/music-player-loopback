import {Entity, belongsTo, model, property} from '@loopback/repository';
import {DateTime} from 'luxon';
import {Playlists} from './playlists.model';
import {Tracks} from './tracks.model';
import {Users} from './users.model';

@model()
export class PlaylistHasTracks extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @belongsTo(
    () => Playlists,
    {
      name: 'playlist',
    },
    {
      type: 'string',
      required: true,
      mongodb: {dataType: 'ObjectId'},
    },
  )
  playlistsId: string;

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
  createdBy: string;

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
  updatedBy: string;

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
  updateAt: DateTime;

  constructor(data?: Partial<PlaylistHasTracks>) {
    super(data);
  }
}

export interface PlaylistHasTracksRelations {
  // describe navigational properties here
}

export type PlaylistHasTracksWithRelations = PlaylistHasTracks &
  PlaylistHasTracksRelations;
