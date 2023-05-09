import {Entity, model, property} from '@loopback/repository';
import { TracksDuration } from './tracksDuration.model';
import { Ratings } from './ratings.model';
import { DateTime } from 'luxon';

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
    jsonSchema:{
      pattern: '^(?! ).*[^ ]$',
      errorMessage:{
        pattern: `Title must not be empty`
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
      enum:['mp3', 'AAC', 'WAV'],
      errorMessage: {
        pattern: `choose from mp3, AAC or WAV only!!`
      },
    },
    default: 'mp3',
  })
  fileType: string;

  @property({

  })
  duration: TracksDuration;

  @property({
    type: 'string',
    required: false,
    jsonSchema: {
      enum: ['srt', 'txt'],
      errorMessage:{
        pattern : `only srt and txt file types are allowed`
      },
    },
  })
  lyricsFileType: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema:{
      enum: ['English', 'Hindi'],
      errorMessage: {
        pattern: `Only English and Hindi languages allowed`
      },
    },
    default: 'Hindi'
  })
  language: string;

  @property({
    type: 'string',
    required: true,
    jsonSchema:{
      pattern: '^(?! ).*[^ ]$',
      errorMessage:{
        pattern:`Should not be empty`
      },
    },
    default: 'Retro Bollywood'
  })
  genre: string;

  @property({
    
  })
  ratings: Ratings;

  @property({
    type: 'number',
    required: true,
    default: 0
  })
  numberOfPlays: number;

  @property({
    type: 'date',
    required: true,
    default: DateTime.utc().toISO()
  })
  publishedDate: DateTime;

  @property({
    type: 'number',
    required: false,
  })
  numberOfDownloads: number;

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
