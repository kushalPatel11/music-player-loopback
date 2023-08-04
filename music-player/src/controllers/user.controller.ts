import {TokenService} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {get, param} from '@loopback/rest';
import {TokenServiceBindings} from '../keys';
import {UsersRepository} from '../repositories';
import {UserService} from '../services';

// @visibility(OperationVisibility.UNDOCUMENTED)
export class UserController {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
    @service(UserService)
    public userService: UserService,
  ) {}

  @get('/user', {
    summary: 'List of users of mentioned userType',
    responses: {
      200: {},
    },
  })
  async findUserType(
    @param({
      name: 'userType',
      in: 'query',
      schema: {
        type: 'string',
        enum: ['user', 'artist'],
        default: 'artist',
      },
    })
    userType: string,
  ): Promise<any> {
    return this.userService.findUserType(userType);
  }
}
