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

  definePersistedModel(entityClass: typeof Tracks) {
    const modelClass = super.definePersistedModel(entityClass);
    modelClass.observe('before save', async ctx => {
      if (!ctx.isNewInstance && ctx.data) {
        ctx.data.updatedAt = new Date();
      }
    });
    return modelClass;
  }
}
