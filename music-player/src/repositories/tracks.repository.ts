import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Tracks, TracksRelations} from '../models';

export class TracksRepository extends DefaultCrudRepository<
  Tracks,
  typeof Tracks.prototype.id,
  TracksRelations
> {
  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
  ) {
    super(Tracks, dataSource);
  }
}
