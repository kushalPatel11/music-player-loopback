import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Playlists, PlaylistsRelations} from '../models';

export class PlaylistsRepository extends DefaultCrudRepository<
  Playlists,
  typeof Playlists.prototype.id,
  PlaylistsRelations
> {
  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
  ) {
    super(Playlists, dataSource);
  }
}
