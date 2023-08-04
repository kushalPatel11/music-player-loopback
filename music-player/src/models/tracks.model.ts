import {Entity, model, property} from '@loopback/repository';
import {DateTime} from 'luxon';

@model()
export class Tracks extends Entity {
  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true,
    },
    jsonSchema: {
      pattern: '^(?! ).*[^ ]$',
      errorMessage: {
        pattern: `Title must not be empty`,
      },
    },
  })
  title: string;

  @property({
    type: 'string',
    required: false,
    default: '',
  })
  description: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['mp3', 'AAC', 'WAV'],
      errorMessage: {
        pattern: `choose from mp3, AAC or WAV only!!`,
      },
    },
    default: 'mp3',
  })
  fileExtension: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['English', 'Hindi'],
      errorMessage: {
        pattern: `Only English and Hindi languages allowed`,
      },
    },
    default: 'Hindi',
  })
  language: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      pattern: '^(?! ).*[^ ]$',
      errorMessage: {
        pattern: `Should not be empty`,
      },
    },
    default: 'Retro Bollywood',
  })
  genre: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema: {
      enum: ['pending', 'released'],
      errorMessage: {
        pattern: `Choose from pending or released only!!`,
      },
    },
    default: 'pending',
  })
  status: string;

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

  constructor(data?: Partial<Tracks>) {
    super(data);
  }
}

export interface TracksRelations {
  // describe navigational properties here
}

export type TracksWithRelations = Tracks & TracksRelations;
