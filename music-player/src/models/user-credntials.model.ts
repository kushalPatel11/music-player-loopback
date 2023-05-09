import {belongsTo, Entity, model, property} from '@loopback/repository';
import { Users } from './users.model';
import { DateTime } from 'luxon';

@model()
export class UserCredntials extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

@belongsTo(
  () =>Users,
  {
    name : 'users',
  },
  {
    type : 'string',
    required: true,
    mongodb: {dataType : 'ObjectId'},
  },
)
userId : string;

  @property({
    type: 'array',
    itemType: 'string',
    default: []
  })
  oldPasswords: string[];

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      pattern: '^((?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,})$',
      errorMessage: {
        pattern: `Must include one uppercase, one lower case, one number, one special character and minimum of 8 characters`,
      },
    },
  })
  password: string;

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


  constructor(data?: Partial<UserCredntials>) {
    super(data);
  }
}

export interface UserCredntialsRelations {
  // describe navigational properties here
}

export type UserCredntialsWithRelations = UserCredntials & UserCredntialsRelations;
