import {Getter, inject} from '@loopback/core';
import {BelongsToAccessor, DefaultCrudRepository, Filter, Options, repository} from '@loopback/repository';
import {MongoDbDataSource} from '../datasources';
import {Session, SessionRelations, Users} from '../models';
import { HttpErrors } from '@loopback/rest';
import { customErrorMsg, musicPlayerConstant } from '../keys';
import { DateTime } from 'luxon';
import {UsersRepository} from './users.repository';

export class SessionRepository extends DefaultCrudRepository<
  Session,
  typeof Session.prototype.id,
  SessionRelations
> {
  public readonly users: BelongsToAccessor<Users, typeof Users.prototype.id>
  constructor(
    @inject('datasources.MongoDb') dataSource: MongoDbDataSource,
    @repository.getter('UserRepository')
    protected usersRepositoryGetter: Getter<UsersRepository>,
  ) {
    super(Session, dataSource);

    //for user
    this.users = this.createBelongsToAccessorFor('users', usersRepositoryGetter);
    this.registerInclusionResolver('user', this.users.inclusionResolver);
  }

  async findOne(filter?: Filter<Session>, options?: Options): Promise<Session> {
    const result = await super.findOne(filter, options);

    if (result) {
      return result;
    } else {
      throw new HttpErrors.NotFound('Entity Not Found : Session');
    }
  }

  async findSessionByToken(token:string){
    const session = await this.findOne({
      where: {
        jwt: token
      }
    });
    if(!session){
      throw new HttpErrors[404](
        customErrorMsg.authErrors.TOKEN_NOT_FOUND
      )
    }

    if(
      DateTime.fromJSDate(session?.expireAt).valueOf() <
      DateTime.utc().valueOf()
    ){
      await this.updateById(session.id,{
        status: musicPlayerConstant.SessionStatus.EXPIRED
      });
    }
    return session;
  }

  definePersistedModel(entityClass: typeof Session) {
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
