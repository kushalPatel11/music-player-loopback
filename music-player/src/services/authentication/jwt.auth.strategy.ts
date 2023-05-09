import {AuthenticationStrategy, TokenService} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors, Request, RestBindings} from '@loopback/rest';
import {UserProfile, securityId} from '@loopback/security';
import {TokenServiceBindings} from '../../keys';
import {Session, Users} from '../../models';
import {SessionRepository} from '../../repositories';
import {UserAuthenticationService} from '../user-authentication.service';

export type AuthCredentials = {
  user: Users;
  session: Session;
  userType: string;
};

export class JWTAuthenticationStrategy implements AuthenticationStrategy {
  name = 'jwt';

  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public tokenService: TokenService,
    @service(UserAuthenticationService)
    public userAuthenticationService: UserAuthenticationService,
    @repository(SessionRepository)
    public sessionRepository: SessionRepository,
  ) {}

  async authenticate(
    request: Request,
  ): Promise<UserProfile | AuthCredentials | undefined | any> {
    // console.log('IN authenticate');
    return this.performJWTStreategy(request);
  }

  async performJWTStreategy(request: Request) {
    // console.log('performJWTStreategy');
    if (!request.headers.authorization) {
      throw new HttpErrors[400](`Authorization header not found.`);
    }

    const authHeadervalue = <string>request.headers.authorization;
    if (!authHeadervalue.startsWith('Bearer')) {
      throw new HttpErrors[401](
        `Authorization header is not of type 'Bearer'.`,
      );
    }

    const parts = authHeadervalue.split(' ');
    if (parts.length !== 2) {
      throw new HttpErrors[401](
        `Authorization value has too many parts. It must follow the pattern: 'Bearer xx.yy.zz' where xx.yy.zz is a valid JWT token.`,
      );
    }

    try {
      const token = parts[1];
      const userProfile: UserProfile = await this.tokenService.verifyToken(
        token,
      );

      const session = <Session>(
        await this.sessionRepository.findSessionByToken(token)
      );
      let user = await this.userAuthenticationService.findUserById(
        userProfile[securityId],
      );
      return {
        user,
        session,
        userType: user.userType
      };
    } catch (err: any) {
      throw new HttpErrors[400](`BadRequest`);
    }
  }
}
