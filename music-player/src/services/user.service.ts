import {TokenService} from '@loopback/authentication';
import {BindingScope, inject, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {compare, hashSync} from 'bcryptjs';
import _ from 'lodash';
import {DateTime} from 'luxon';
import {
  TokenServiceBindings,
  customErrorMsg,
  musicPlayerConstant,
} from '../keys';
import {Users, UsersWithRelations} from '../models';
import {
  SessionRepository,
  UserCredentialsRepository,
  UsersRepository,
} from '../repositories';
import {checkOldPasswords, generateRandomString} from '../utils/helper';

type SignUpParams = {
  payload: {
    firstName: string;
    lastName: string;
    userType: string;
    email: string;
    password: string;
    dateOfBirth: DateTime;
    phoneNumber: string;
    countryCode: string;
    gender: string;
  };
};

type LoginParams = {
  payload: {
    email: string;
    password: string;
  };
};

type LogoutParams = {
  sessionId: string;
};

type forgotPasswordParams = {
  emailId: string;
};

type resetPasswordParams = {
  payload: {
    token: string;
    newPassword: string;
    confirmPassword: string;
  };
};

type changePasswordParams = {
  payload: {
    oldPassword: string;
    newPassword: string;
    confirmNewPassword: string;
  };
  userId: string;
};

@injectable({scope: BindingScope.TRANSIENT})
export class UserService {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
    @repository(UserCredentialsRepository)
    public userCredentialsRepository: UserCredentialsRepository,
    @repository(SessionRepository)
    public sessionRepository: SessionRepository,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
  ) {}

  async signUp({payload}: SignUpParams) {
    await this.usersRepository.checkEmail(payload.email);
    const passwordValue = payload.password;
    let createUserPayload: any = _.omit(payload, ['password']);
    const user = await this.usersRepository.create(createUserPayload);
    await this.userCredentialsRepository.create({
      userId: user.id,
      password: hashSync(passwordValue),
    });
    return user;
  }

  async login({payload}: LoginParams) {
    const user = await this.usersRepository.findOne({
      where: {
        email: payload.email,
      },
    });

    if (!user) {
      throw new HttpErrors.BadRequest(
        customErrorMsg.authErrors.EMAIL_NOT_FOUND,
      );
    }

    const userCredentials = await this.userCredentialsRepository.findOne({
      where: {userId: user.id},
    });
    if (!userCredentials) {
      throw new HttpErrors.BadRequest(
        customErrorMsg.authErrors.USER_ID_NOT_FOUND,
      );
    }

    const isPasswordMatch = await compare(
      payload.password,
      userCredentials.password,
    );
    if (!isPasswordMatch) {
      throw new HttpErrors[401](customErrorMsg.authErrors.INCORRECT_PASSWORD);
    }

    const userProfile = this.convertToUserProfile(user);

    // create a JSON Web Token based on the user profile
    const token = await this.jwtService.generateToken(userProfile);

    const EXPIRATION_PERIOD = '24h';

    // create session for user
    const userSession = await this.sessionRepository.create({
      userId: user?.id,
      jwt: token,
      status: 'current',
      loginAt: DateTime.utc(),
      expireAt: DateTime.utc().plus({
        hours: parseInt(EXPIRATION_PERIOD),
      }),
    });

    return userSession.jwt;
  }

  async logout({sessionId}: LogoutParams) {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) {
      throw new HttpErrors[404](customErrorMsg.authErrors.SESSION_ID_NOT_FOUND);
    }
    if (session?.status === musicPlayerConstant.SessionStatus.EXPIRED) {
      throw new HttpErrors.BadRequest(
        customErrorMsg.authErrors.ALREADY_LOGGED_OUT,
      );
    }

    await this.sessionRepository.updateById(session.id, {
      status: musicPlayerConstant.SessionStatus.EXPIRED,
      expiredAt: <any>DateTime.utc().toJSDate(),
    });

    return {message: 'logout successful'};
  }

  async forgotPassword({emailId}: forgotPasswordParams) {
    const checkEmail = await this.usersRepository.findOne({
      where: {
        email: emailId,
      },
    });
    if (!checkEmail) {
      throw new HttpErrors[404](customErrorMsg.authErrors.EMAIL_NOT_FOUND);
    }
    const generatedToken = generateRandomString(200);
    await this.usersRepository.updateById(checkEmail.id, {
      forgotPasswordToken: {
        //  ...checkEmail.forgotPasswordToken,
        token: generatedToken,
        status: musicPlayerConstant.SessionStatus.CURRENT,
        createdAt: DateTime.utc().toJSDate(),
        expireAt: DateTime.utc().plus({minutes: 5}).toJSDate(),
        expiredAt: null,
      },
    });
    return generatedToken;
  }

  async resetPassword({payload}: resetPasswordParams) {
    if (payload.newPassword !== payload.confirmPassword) {
      throw new HttpErrors[403](customErrorMsg.authErrors.PASSWORDS_DONT_MATCH);
    }
    const verifyToken = await this.usersRepository.findOne({
      where: <any>{
        'forgotPasswordToken.token': payload.token,
        'forgotPasswordToken.status': musicPlayerConstant.SessionStatus.CURRENT,
      },
    });
    if (!verifyToken) {
      throw new HttpErrors[404](customErrorMsg.authErrors.INVALID_TOKEN);
    }

    let expiredTime = verifyToken?.forgotPasswordToken?.expireAt;
    if (
      DateTime.fromJSDate(
        <any>verifyToken.forgotPasswordToken?.expireAt,
      ).valueOf() < DateTime.utc().valueOf()
    ) {
      await this.usersRepository.updateById(verifyToken.id, <any>{
        'forgotPasswordToken.status': musicPlayerConstant.SessionStatus.EXPIRED,
        'forgotPasswordToken.expiredAt': expiredTime,
      });
      throw new HttpErrors[403](customErrorMsg.authErrors.TOKEN_EXPIRED);
    }

    const userId: any = await this.userCredentialsRepository.findOne({
      where: {
        userId: verifyToken.id,
      },
    });

    const passwordArray: any = userId?.oldPasswords;
    const currentPassword = userId.password;
    const comparePassword = await compare(payload.newPassword, currentPassword);

    if (comparePassword === true) {
      throw new HttpErrors[403](customErrorMsg.authErrors.PASSWORD_NOT_ALLOWED);
    }

    await checkOldPasswords(payload.newPassword, passwordArray);

    if (passwordArray.length <= 2) {
      passwordArray.unshift(currentPassword);
    } else {
      passwordArray.pop();
      passwordArray.unshift(currentPassword);
    }

    await this.userCredentialsRepository.updateById(userId?.id, {
      password: hashSync(payload.confirmPassword),
      oldPasswords: passwordArray,
    });
    await this.usersRepository.updateById(verifyToken.id, <any>{
      'forgotPasswordToken.status': musicPlayerConstant.SessionStatus.EXPIRED,
      'forgotPasswordToken.expiredAt': DateTime.utc().toJSDate(),
    });
    return musicPlayerConstant.AuthStatus.PASSWORD_CHANGE_SUCCESSFULL;
  }

  async changePassword({payload, userId}: changePasswordParams) {
    const checkUserId = await this.userCredentialsRepository.findOne({
      where: {
        userId,
      },
    });
    if (!checkUserId) {
      throw new HttpErrors[404](
        customErrorMsg.authErrors.USER_ID_NOT_FOUND,
      );
    }

    const matchPassword = await compare(
      payload.oldPassword,
      checkUserId.password,
    );
    if (!matchPassword) {
      throw new HttpErrors[400](customErrorMsg.authErrors.INCORRECT_PASSWORD);
    }

    if (payload.oldPassword === payload.newPassword) {
      throw new HttpErrors[403](
        customErrorMsg.authErrors.PASSWORD_CANT_BE_SAME,
      );
    }

    if (payload.newPassword !== payload.confirmNewPassword) {
      throw new HttpErrors[403](customErrorMsg.authErrors.PASSWORDS_DONT_MATCH);
    }

    const passwordArray = checkUserId.oldPasswords;
    const currentPassword = checkUserId.password;
    const comparePassword = await compare(payload.newPassword, currentPassword);

    if (comparePassword === true) {
      throw new HttpErrors[403](customErrorMsg.authErrors.PASSWORD_NOT_ALLOWED);
    }

    await checkOldPasswords(payload.newPassword, passwordArray);

    if (passwordArray.length <= 2) {
      passwordArray.unshift(currentPassword);
    } else {
      passwordArray.pop();
      passwordArray.unshift(currentPassword);
    }

    await this.userCredentialsRepository.updateById(checkUserId.id, {
      password: hashSync(payload.newPassword),
      oldPasswords: passwordArray,
    });
    return musicPlayerConstant.AuthStatus.PASSWORD_CHANGE_SUCCESSFULL;
  }

  async findUserType(userType: string) {
    const checkUserType = await this.usersRepository.find({
      where: {
        userType: userType,
      },
    });

    const customArray = checkUserType.map(prop => {
      let obj = {
        id: prop.id,
        name: `${prop.firstName} ${prop.lastName}`,
      };
      return obj;
    });
    return customArray;
  }

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

  convertToUserProfile(user: Users): UserProfile {
    return {
      [securityId]: user.id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id,
      email: user.email,
      userType: user.userType,
    };
  }
}
