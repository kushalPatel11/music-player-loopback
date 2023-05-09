import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {compare, hashSync} from 'bcryptjs';
import {DateTime} from 'luxon';
import {customErrorMsg, musicPlayerConstant} from '../keys';
import {Users, UsersWithRelations} from '../models';
import {
  SessionRepository,
  UserCredentialsRepository,
  UsersRepository,
} from '../repositories';
import {checkOldPasswords, generateRandomString} from '../utils/helper';

@injectable({scope: BindingScope.TRANSIENT})
export class UserAuthenticationService {
  [x: string]: any;
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
    @repository(UserCredentialsRepository)
    public userCredentialsRepository: UserCredentialsRepository,
    @repository(SessionRepository)
    public sessionRepository: SessionRepository,
  ) {}

  async findUserById(id: string): Promise<Users & UsersWithRelations> {
    const userNotfound = 'invalid User';
    const foundUser = await this.usersRepository.findOne({
      where: {id: id},
    });

    if (!foundUser) {
      throw new HttpErrors.Unauthorized(userNotfound);
    }
    return foundUser;
  }
  // function to chnage password when the user is logged In
  async changePassword(userId: string,oldPassword: string,newPassword: string,){}
  //  function to generate a token and save when forget password API is called
  async forgotPassword(emailId: string) {}

  async resetPassword(token: any, newPassword: any, confirmNewPassword: any) {}
}
