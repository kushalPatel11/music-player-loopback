import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {PlaylistHasUsers, PlaylistHasUsersRelations} from '../models';

export class PlaylistHasUsersRepository extends DefaultCrudRepository<
  PlaylistHasUsers,
  typeof PlaylistHasUsers.prototype.id,
  PlaylistHasUsersRelations
> {
  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
  ) {
    super(PlaylistHasUsers, dataSource);
  }

  definePersistedModel(entityClass: typeof PlaylistHasUsers) {
    const modelClass = super.definePersistedModel(entityClass);
    modelClass.observe('before save', async ctx => {
      if (!ctx.isNewInstance && ctx.data) {
        ctx.data.updatedAt = new Date();
      }
    });
    return modelClass;
  }
}
