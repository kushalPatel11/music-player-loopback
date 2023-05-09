import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {MongoDbDataSource} from '../datasources';
import {customErrorMsg} from '../keys';
import {Users, UsersRelations} from '../models';

export class UsersRepository extends DefaultCrudRepository<
  Users,
  typeof Users.prototype.id,
  UsersRelations
> {
  constructor(@inject('datasources.MongoDb') dataSource: MongoDbDataSource) {
    super(Users, dataSource);
  }

  async checkEmail(email: string) {
    const checkEmail = await this.findOne({
      where: {
        email,
      },
    });
    if (checkEmail) {
      throw new HttpErrors.BadRequest(
        customErrorMsg.authErrors.EMAIL_ALREADY_EXISTS,
      );
    }
  }

  definePersistedModel(entityClass: typeof Users) {
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
