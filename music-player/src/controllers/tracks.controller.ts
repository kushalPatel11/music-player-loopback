import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {service} from '@loopback/core';
import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
} from '@loopback/rest';
import {customErrorMsg} from '../keys';
import {Tracks} from '../models';
import {TracksRepository} from '../repositories';
import {TracksService} from '../services';

@authenticate('jwt')
@authorize({
  allowedRoles: ['artist'],
})
export class TracksController {
  constructor(
    @repository(TracksRepository)
    public tracksRepository: TracksRepository,
    @service(TracksService)
    public tracksService: TracksService,
  ) {}

  @post('/tracks-upload')
  @response(200, {
    description: 'Upload track endpoint',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
              default: '',
            },
            artistIds: {
              type: 'array',
              // item: 'string',
              default: [],
            },
            description: {
              type: 'string',
              default: '',
            },
            fileExtension: {
              type: 'string',
              default: 'mp3',
            },
            language: {
              type: 'string',
              default: 'english',
            },
            genre: {
              type: 'string',
            },
          },
        },
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: [
              'title',
              'artistIds',
              'description',
              'fileExtension',
              'language',
              'genre',
            ],
            properties: {
              title: {
                type: 'string',
                pattern: '^(?! ).*[^ ]$',
                errorMessage: {
                  pattern: customErrorMsg.trackErrors.EMPTY_TRACK_TITLE,
                },
                default: '',
              },
              artistIds: {
                type: 'array',
                minItems: 1,
                pattern: '^([0-9a-fA-F]{24})$',
                errorMessage: {
                  pattern: customErrorMsg.trackErrors.INVALID_ARTIST_ID,
                },
                default: [],
              },
              description: {
                type: 'string',
                pattern: '^(?! ).*[^ ]$',
                errorMessage: {
                  pattern: customErrorMsg.trackErrors.EMPTY_DESCRIPTION,
                },
                default: '',
              },
              fileExtension: {
                type: 'string',
                enum: ['mp3', 'WAV', 'AAC'],
                errorMessage: {
                  pattern: customErrorMsg.trackErrors.INVALID_FILE_EXTENSION,
                },
                default: 'mp3',
              },
              language: {
                type: 'string',
                enum: ['english', 'hindi'],
                errorMessage: {
                  pattern: customErrorMsg.trackErrors.LANGUAGE_NOT_ALLOWED,
                },
                default: 'english',
              },
              genre: {
                type: 'string',
                enum: ['rock', 'pop', 'jazz', 'romantic', 'lofi', 'spiritual'],
                errorMessage: {
                  pattern: customErrorMsg.trackErrors.GENRE_NOT_ALLOWED,
                },
              },
            },
          },
        },
      },
    })
    payload: {
      title: string;
      artistIds: string[];
      description: string;
      fileExtension: string;
      language: string;
      genre: string;
    },
  ): Promise<any> {
    return this.tracksService.createTrack({payload});
  }

  @get('/tracks')
  @response(200, {
    description: 'Array of Tracks model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Tracks, {includeRelations: true}),
        },
      },
    },
  })
  async find(@param.filter(Tracks) filter?: Filter<Tracks>): Promise<Tracks[]> {
    return this.tracksRepository.find(filter);
  }

  @get('/tracks/{id}')
  @response(200, {
    description: 'Tracks model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Tracks, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Tracks, {exclude: 'where'})
    filter?: FilterExcludingWhere<Tracks>,
  ): Promise<Tracks> {
    return this.tracksRepository.findById(id, filter);
  }

  @del('/tracks/{id}')
  @response(204, {
    description: 'Tracks DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tracksRepository.deleteById(id);
  }
}
