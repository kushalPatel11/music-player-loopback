import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {TrackHasArtist, TrackHasArtistRelations} from '../models';

export class TrackHasArtistRepository extends DefaultCrudRepository<
  TrackHasArtist,
  typeof TrackHasArtist.prototype.id,
  TrackHasArtistRelations
> {
  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
  ) {
    super(TrackHasArtist, dataSource);
  }
}
