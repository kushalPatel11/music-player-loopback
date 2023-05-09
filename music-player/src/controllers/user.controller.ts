import {TokenService} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {FilterExcludingWhere, repository} from '@loopback/repository';
import {
  OperationVisibility,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
  visibility,
} from '@loopback/rest';
import {TokenServiceBindings} from '../keys';
import {Users} from '../models';
import {
  SessionRepository,
  UserCredentialsRepository,
  UsersRepository,
} from '../repositories';
import {UserAuthenticationService} from '../services/user-authentication.service';

@visibility(OperationVisibility.UNDOCUMENTED)
export class UserController {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
    @repository(UserCredentialsRepository)
    public userCredentialsRepository: UserCredentialsRepository,
    @repository(SessionRepository)
    public sessionRepository: SessionRepository,
    @service(UserAuthenticationService)
    public userAuthenticationService: UserAuthenticationService,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
  ) {}

  @get('/user/{id}')
  @response(200, {
    description: 'Get user account',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Users, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Users, {exclude: 'where'})
    filter?: FilterExcludingWhere<Users>,
  ): Promise<Users> {
    return this.usersRepository.findById(id, filter);
  }
}
