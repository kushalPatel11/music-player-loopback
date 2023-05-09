import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {UserCredntials, UserCredntialsRelations} from '../models';
// import {hashSync} from "bcryptjs";

export class UserCredentialsRepository extends DefaultCrudRepository<
  UserCredntials,
  typeof UserCredntials.prototype.id,
  UserCredntialsRelations
> {
  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
  ) {
    super(UserCredntials, dataSource);
  }

  definePersistedModel(entityClass: typeof UserCredntials) {
    const modelClass = super.definePersistedModel(entityClass);
    modelClass.observe('before save', async ctx => {
      if (!ctx.isNewInstance && ctx.data) {
        ctx.data.updatedAt = new Date();
        // console.log(ctx.data);
      }
    });
    return modelClass;
  }
}
