import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {service} from '@loopback/core';
import {Filter, FilterExcludingWhere, repository} from '@loopback/repository';
import {
  OperationVisibility,
  del,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
  response,
  visibility,
} from '@loopback/rest';
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

  @visibility(OperationVisibility.UNDOCUMENTED)
  @post('/tracks-upload')
  @response(200, {
    description: 'Tracks model instance',
    content: {'application/json': {schema: getModelSchemaRef(Tracks)}},
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
                  pattern: `can't be blank`,
                },
                default: '',
              },
              artistIds: {
                type: 'array',
                minItems: 1,
                pattern: '^([0-9a-fA-F]{24})$',
                errorMessage: {
                  pattern: `must be a valid MongoDB Id`,
                },
              },
              description: {
                type: 'string',
                pattern: '^(?! ).*[^ ]$',
                errorMessage: {
                  pattern: `can't be blank`,
                },
                default: '',
              },
              fileExtension: {
                type: 'string',
                enum: [],
                errorMessage: {
                  pattern: '',
                },
                default: '',
              },
              language: {
                type: 'string',
                enum: [],
                errorMessage: {
                  pattern: '',
                },
                default: '',
              },
              genre: {
                type: 'string',
                enum: [],
                errorMessage: {
                  pattern: '',
                },
                default: '',
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
