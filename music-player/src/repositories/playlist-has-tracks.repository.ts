import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {PlaylistHasTracks, PlaylistHasTracksRelations} from '../models';

export class PlaylistHasTracksRepository extends DefaultCrudRepository<
  PlaylistHasTracks,
  typeof PlaylistHasTracks.prototype.id,
  PlaylistHasTracksRelations
> {
  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
  ) {
    super(PlaylistHasTracks, dataSource);
  }
}
