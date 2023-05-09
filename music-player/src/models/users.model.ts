import {Entity, model, property} from '@loopback/repository';
import {DateTime} from 'luxon';
import {ForgotPasswordData} from './forgot-password-data.model';

@model()
export class Users extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
    mongodb: {dataType: 'ObjectId'},
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      pattern: '^(?! ).*[^ ]$',
      errorMessage: {
        pattern: `can't be blank`,
      },
    },
  })
  firstName: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      pattern: '^(?! ).*[^ ]$',
      errorMessage: {
        pattern: `can't be blank`,
      },
    },
  })
  lastName: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['user', 'artist'],
      errorMessage: {
        pattern: `choose from "user"  or "artist" only!!`,
      },
    },
    default: 'user',
  })
  userType: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
    jsonSchema: {
      format: 'email',
      errorMessage: {
        pattern: `Invalid email`,
      },
    },
  })
  email: string;

  @property({
    type: ForgotPasswordData,
    default: new ForgotPasswordData(),
  })
  forgotPasswordToken?: ForgotPasswordData;

  @property({
    type: 'date',
    required: false,
    jsonSchema: {
      nullable: true,
    },
  })
  dateOfBirth: DateTime;

  //   phoneNumber validation: exactly 10 digits required in this format 1234567890
  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      pattern: '^\\d{10}$',
      errorMessage: {
        pattern: `Invalid phone number; exactly 10 digits required in this format 1234567890`,
      },
    },
  })
  phoneNumber: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      pattern: '^\\+\\d{1,3}$',
      errorMessage: {
        pattern: `Invalid country code`,
      },
    },
  })
  countryCode: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['male', 'female', 'other'],
      errorMessage: {
        pattern: `choose from male, female and other only!!`,
      },
    },
  })
  gender: string;

  @property({
    type: 'date',
    required: true,
    default: () => DateTime.utc().toJSDate(),
  })
  createdAt: DateTime;

  @property({
    type: 'date',
    required: true,
    default: () => DateTime.utc().toJSDate(),
  })
  updatedAt: DateTime;

  constructor(data?: Partial<Users>) {
    super(data);
  }
}

export interface UsersRelations {
  // describe navigational properties here
}

export type UsersWithRelations = Users & UsersRelations;
