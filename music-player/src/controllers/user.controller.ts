import {TokenService} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {OperationVisibility, requestBody, response, visibility,get, post} from '@loopback/rest';
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

  @post('/user')
  @response(200,{
    description: 'Get user type',
  })
  async findUserType(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['userType'],
            properties: {
              userType: {
                type: 'string',
                default: 'user'
              },
            }

          }
        },
      },
    })
    payload:{
      userType: string;
    }
  ):Promise<any>{
    return this.userService.findUserType(payload)
  }

}
