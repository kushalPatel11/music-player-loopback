import {TokenService} from '@loopback/authentication';
import {inject} from '@loopback/core';
import {HttpErrors} from '@loopback/rest';
import {securityId, UserProfile} from '@loopback/security';
import {promisify} from 'util';
import {TokenServiceBindings} from '../../keys';

const jwt = require('jsonwebtoken');
const signAsync = promisify(jwt.sign);
const verifyAsync = promisify(jwt.verify);

export class JWTService implements TokenService {
  constructor(
    @inject(TokenServiceBindings.TOKEN_SECRET)
    private jwtSecret: string,
    @inject(TokenServiceBindings.TOKEN_EXPIRES_IN)
    private jwtExpiresIn: string,
  ) {}

  async verifyToken(token: string): Promise<UserProfile> {
    if (!token) {
      throw new HttpErrors[401](`Error verifying token: 'token is null'`);
    }

    let userProfile: UserProfile;

    try {
      const decodedToken = await verifyAsync(token, this.jwtSecret);

      userProfile = {
        [securityId]: decodedToken.id,
        ...decodedToken,
      };
    } catch (error) {
      throw new HttpErrors[401](`Error verifying token: ${error.message}`);
    }
    return userProfile;
  }

  async generateToken(userProfile: UserProfile): Promise<string> {
    if (!userProfile) {
      throw new HttpErrors[401](`Error generating token: 'userProfile null'`);
    }

    const userInfoToken = {
      id: userProfile[securityId],
      firstName: userProfile.firstName,
      lastName: userProfile.lastName,
      email: userProfile.email,
      userType: userProfile.userType,
    };
    let token: string;
    try {
      token = await signAsync(userInfoToken, this.jwtSecret, {
        expiresIn: Number(this.jwtExpiresIn),
      });
    } catch (error) {
      throw new HttpErrors[401](`Error encoding token: ${error}`);
    }
    return token;
  }
}
