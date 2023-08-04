import {TokenService, authenticate} from '@loopback/authentication';
import {inject, service} from '@loopback/core';
import {get, post, requestBody} from '@loopback/rest';
import {SecurityBindings} from '@loopback/security';
import {DateTime} from 'luxon';
import {TokenServiceBindings, customErrorMsg} from '../keys';
import {Session, Users} from '../models';
import {UserService} from '../services';
import {AuthCredentials} from '../services/authentication/jwt.auth.strategy';

export class AuthController {
  constructor(
    @service(UserService)
    public userService: UserService,
    @inject(TokenServiceBindings.TOKEN_SERVICE)
    public jwtService: TokenService,
  ) {}

  //SignUp/Register API Endpoint
  @post('/auth/sign-up', {
    summary: 'SignUp/Register API Endpoint',
    responses: {
      '200': {
        content: {
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: [
                  'firstName',
                  'lastName',
                  'userType',
                  'email',
                  'password',
                  'dateOfBirth',
                  'phoneNumber',
                  'countryCode',
                  'gender',
                ],
                properties: {
                  firstName: {
                    type: 'string',
                    pattern: '^(?! ).*[^ ]$',
                    errorMessage: {
                      pattern: `can't be blank`,
                    },
                    default: '',
                  },
                  lastName: {
                    type: 'string',
                    pattern: '^(?! ).*[^ ]$',
                    errorMessage: {
                      pattern: `can't be blank`,
                    },
                    default: '',
                  },
                  userType: {
                    type: 'string',
                    enum: ['user', 'artist'],
                    errorMessage: {
                      pattern: customErrorMsg.authErrors.INVALID_USER_TYPE,
                    },
                  },
                  email: {
                    type: 'string',
                    format: 'email',
                    errorMessage: {
                      pattern: customErrorMsg.authErrors.INVALID_EMAIL,
                    },
                    default: 'user@linearloop.io'
                  },
                  password: {
                    type: 'string',
                    pattern:
                      '^((?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,})$',
                    errorMessage: {
                      pattern:
                        customErrorMsg.authErrors.PASSWORD_VALIDATION_FAILED,
                    },
                    default: 'Admin@123',
                  },
                  dateOfBirth: {
                    'x-ts-type': Date,
                    nullable: true,
                    errorMessage: {
                      pattern: customErrorMsg.authErrors.INVALID_DOB_FORMAT,
                    },
                  },
                  phoneNumber: {
                    type: 'string',
                    pattern: '^\\d{10}$',
                    errorMessage: {
                      pattern: customErrorMsg.authErrors.INVALID_PHONE_NUMBER,
                    },
                  },
                  countryCode: {
                    type: 'string',
                    pattern: '^\\+\\d{1,3}$',
                    errorMessage: {
                      pattern: customErrorMsg.authErrors.INVALID_COUNTRY_CODE,
                    },
                  },
                  gender: {
                    type: 'string',
                    enum: ['male', 'female', 'other'],
                    errorMessage: {
                      pattern: `Select from male, female, or other only`,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  })
  async signUp(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              'firstName',
              'lastName',
              'userType',
              'email',
              'password',
              'dateOfBirth',
              'phoneNumber',
              'countryCode',
              'gender',
            ],
            properties: {
              firstName: {
                type: 'string',
                pattern: '^(?! ).*[^ ]$',
                errorMessage: {
                  pattern: `can't be blank`,
                },
                default: '',
              },
              lastName: {
                type: 'string',
                pattern: '^(?! ).*[^ ]$',
                errorMessage: {
                  pattern: `can't be blank`,
                },
                default: '',
              },
              userType: {
                type: 'string',
                enum: ['user', 'artist'],
                errorMessage: {
                  pattern: customErrorMsg.authErrors.INVALID_USER_TYPE,
                },
                default: 'artist',
              },
              email: {
                type: 'string',
                format: 'email',
                errorMessage: {
                  pattern: customErrorMsg.authErrors.INVALID_EMAIL,
                },
                default: 'user@linearloop.io'
              },
              password: {
                type: 'string',
                pattern:
                  '^((?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,})$',
                errorMessage: {
                  pattern: customErrorMsg.authErrors.PASSWORD_VALIDATION_FAILED,
                },
                default: 'Admin@123',
              },
              dateOfBirth: {
                'x-ts-type': Date,
                nullable: true,
                errorMessage: {
                  pattern: customErrorMsg.authErrors.INVALID_DOB_FORMAT,
                },
              },
              phoneNumber: {
                type: 'string',
                pattern: '^\\d{10}$',
                errorMessage: {
                  pattern: customErrorMsg.authErrors.INVALID_PHONE_NUMBER,
                },
              },
              countryCode: {
                type: 'string',
                pattern: '^\\+\\d{1,3}$',
                errorMessage: {
                  pattern: customErrorMsg.authErrors.INVALID_COUNTRY_CODE,
                },
              },
              gender: {
                type: 'string',
                enum: ['male', 'female', 'other'],
                errorMessage: {
                  pattern: `Select from male, female, or other only`,
                },
              },
            },
          },
        },
      },
    })
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
    },
  ): Promise<any> {
    return this.userService.signUp({
      payload,
    });
  }

  //Login API Endpoint
  @post('/auth/login', {
    summary: 'User Login',
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['email', 'password'],
              properties: {
                email: {
                  type: 'string',
                  format: 'email',
                  default: 'user@linearloop.io',
                },
                password: {
                  type: 'string',
                  default: '',
                },
              },
            },
          },
        },
      },
    },
  })
  async login(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email', 'password'],
            properties: {
              email: {
                type: 'string',
                format: 'email',
                default: 'user@linearloop.io',
              },
              password: {
                type: 'string',
                default: '',
              },
            },
          },
        },
      },
    })
    payload: {
      email: string;
      password: string;
    },
  ): Promise<any> {
    return this.userService.login({payload});
  }

  //Logout API Endpoint
  @authenticate('jwt')
  @get('/auth/logout', {
    summary: 'Logout current logged in user',
    responses: {
      '200': {},
    },
  })
  async logout(
    @inject(SecurityBindings.USER)
    authCredentials: AuthCredentials,
  ): Promise<any> {
    return this.userService.logout({
      sessionId: <string>authCredentials.session.id,
    });
  }

  // ForgotPassword API Endpoint
  @post('/auth/forgot-password', {
    summary: 'Forgot Password',
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                emailId: {
                  type: 'string',
                  format: 'email',
                  default: 'user@linearloop.io'
                },
              },
            },
          },
        },
      },
    },
  })
  async forgotPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['email'],
            properties: {
              emailId: {
                type: 'string',
                format: 'email',
                default: 'user@linearloop.io'
              },
            },
          },
        },
      },
    })
    payload: {
      emailId: string;
    },
  ): Promise<any> {
    return this.userService.forgotPassword(payload);
  }

  //  ResetPassword API Endpoint
  @post('/auth/reset-password', {
    summary: 'Reset Password with token',
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                token: {
                  type: 'string',
                  default: '',
                },
                newPassword: {
                  type: 'string',
                  default: '',
                },
                confirmPassword: {
                  type: 'string',
                  default: '',
                },
              },
            },
          },
        },
      },
    },
  })
  async resetPassword(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['token', 'newPassword', 'confirmPassword'],
            properties: {
              token: {
                type: 'string',
                default: '',
              },
              newPassword: {
                type: 'string',
                pattern:
                  '^((?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,})$',
                errorMessage: {
                  pattern: `Must include one uppercase, one lower case, one number, one special character and minimum of 8 characters`,
                },
                default: '',
              },
              confirmPassword: {
                type: 'string',
                default: '',
              },
            },
          },
        },
      },
    })
    payload: {
      token: string;
      newPassword: string;
      confirmPassword: string;
    },
  ): Promise<any> {
    return this.userService.resetPassword({payload});
  }

  // ChnagePassword API Endpoint
  @authenticate('jwt')
  @post('/auth/change-password', {
    summary: 'Change password of logged in user',
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                oldPassword: {
                  type: 'string',
                },
                newPassword: {
                  type: 'string',
                },
                confirmNewPassword: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async changePassword(
    // @param.path.string('userId') userId: string,
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['oldPassword', 'newPassword'],
            properties: {
              oldPassword: {
                type: 'string',
                default: '',
              },
              newPassword: {
                type: 'string',
                pattern:
                  '^((?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,})$',
                errorMessage: {
                  pattern: `Must include one uppercase, one lower case, one number, one special character and minimum of 8 characters`,
                },
                default: '',
              },
              confirmNewPassword: {
                type: 'string',
                default: '',
              },
            },
          },
        },
      },
    })
    payload: {
      oldPassword: string;
      newPassword: string;
      confirmNewPassword: string;
    },
    @inject(SecurityBindings.USER)
    authCredentials: AuthCredentials,
  ): Promise<any> {
    return this.userService.changePassword({
      payload,
      userId: <string>authCredentials.user.id,
    });
  }

  //WhoAmI API Endpoint - To get the logged in user's data
  @authenticate('jwt')
  @get('auth/whoAmI', {
    summary: 'Get info of logged in user',
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                user: {
                  'x-ts-type': Users,
                },
                session: {
                  'x-ts-type': Session,
                },
              },
            },
          },
        },
      },
    },
  })
  async whoAmI(
    @inject(SecurityBindings.USER)
    authCredentials: AuthCredentials,
  ): Promise<object> {
    return authCredentials;
  }
}
