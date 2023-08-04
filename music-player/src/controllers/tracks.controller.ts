import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject, service} from '@loopback/core';
import {FilterExcludingWhere, repository} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  param,
  post,
  requestBody,
} from '@loopback/rest';
import {SecurityBindings} from '@loopback/security';
import {customErrorMsg} from '../keys';
import {Tracks} from '../models';
import {TracksRepository} from '../repositories';
import {TracksService} from '../services';
import {AuthCredentials} from '../services/authentication/jwt.auth.strategy';

@authenticate('jwt')
@authorize({
  allowedRoles: ['artist'],
})
export class TracksController {
  userId: any;
  constructor(
    @inject(SecurityBindings.USER)
    public authCredentials: AuthCredentials,
    @repository(TracksRepository)
    public tracksRepository: TracksRepository,
    @service(TracksService)
    public tracksService: TracksService,
  ) {
    this.userId = <string>authCredentials.user.id;
  }


  @post('/tracks-upload', {
    summary: 'Upload Track',
    responses: {
      '200': {
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
    return this.tracksService.createTrack({
      payload,
      loggedInUserId: this.userId,
    });
  }

  @get('/tracks/{id}', {
    summary: 'Find Track by Id',
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: getModelSchemaRef(Tracks, {includeRelations: true}),
          },
        },
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

  @post('/tracks/collaboration-decision/', {
    summary: 'Set the collaboration decision of logged in Artist',
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              properties: {
                collaborationToken: {
                  type: 'string',
                  default: '',
                },
                collaborationStatus: {
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
  async collaborationDecision(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['collaborationToken', 'collaborationStatus'],
            properties: {
              collaborationToken: {
                type: 'string',
                default: '',
              },
              collaborationStatus: {
                type: 'string',
                enum: ['accepted', 'rejected'],
                errorMessage: {
                  pattern:
                    customErrorMsg.trackErrors.COLLABORATION_REQUEST_ENUM_ERROR,
                },
                default: '',
              },
            },
          },
        },
      },
    })
    payload: {
      collaborationToken: string;
      collaborationStatus: string;
    },
  ): Promise<any> {
    return await this.tracksService.collaborationDecision({
      payload,
      artistId: this.userId,
    });
  }

  @get('/tracks/get-list-of-collaboration-requests', {
    summary: 'Get list of collaboration requests',
    responses: {
      '200': {},
    },
  })
  async getPendingCollaborationRequests(
    @param({
      name: 'getStatus',
      in: 'query',
      schema: {
        type: 'string',
        enum: ['pending', 'accepted', 'rejected'],
        default: 'pending',
      },
    })
    getStatus: string,
  ): Promise<any> {
    return this.tracksService.getPendingCollaborationRequests(
      this.userId,
      getStatus,
    );
  }

  @del('/tracks/{id}', {
    summary: 'Delete Track by Id',
    responses: {
      '204': {},
    },
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.tracksRepository.deleteById(id);
  }
}
