import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
import {inject, service} from '@loopback/core';
import {repository} from '@loopback/repository';
import {del, param, post, requestBody, response} from '@loopback/rest';
import {SecurityBindings} from '@loopback/security';
import {customErrorMsg} from '../keys';
import {PlaylistsRepository} from '../repositories';
import {PlaylistService} from '../services';
import {AuthCredentials} from '../services/authentication/jwt.auth.strategy';

@authenticate('jwt')
@authorize({
  allowedRoles: ['user'],
})
export class PlaylistController {
  userId: any;
  constructor(
    @inject(SecurityBindings.USER)
    public authCredentials: AuthCredentials,
    @repository(PlaylistsRepository)
    public playlistsRepository: PlaylistsRepository,
    @service(PlaylistService)
    public playlistService: PlaylistService,
  ) {
    this.userId = <string>authCredentials.user.id;
  }

  @post('/create-playlist', {
    summary: 'create playlist',
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['name', 'description'],
              properties: {
                name: {
                  type: 'string',
                  default: '',
                },
                description: {
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
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['name', 'description'],
            properties: {
              name: {
                type: 'string',
                pattern: '^(?! ).*[^ ]$',
                errorMessage: {
                  pattern: customErrorMsg.playlistErrors.EMPTY_PLAYLIST_NAME,
                },
                default: '',
              },
              description: {
                type: 'string',
                pattern: '^(?! ).*[^ ]$',
                errorMessage: {
                  pattern: customErrorMsg.playlistErrors.EMPTY_DESCRIPTION,
                },
                default: '',
              },
            },
          },
        },
      },
    })
    payload: {
      name: string;
      description: string;
    },
  ): Promise<any> {
    return this.playlistService.createPlaylist({
      payload,
      createdBy: this.userId,
      updatedBy: this.userId,
      userId: this.userId,
    });
  }

  @post('/invite-users-to-playlist', {
    summary: 'Invite users to your playlist',
    responses: {
      '200': {
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['emailsToInvite', 'playlistId'],
              proprties: {
                emailsToInvite: {
                  type: 'array',
                },
                playlistId: {
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  })
  async inviteUserToPlaylist(
    @requestBody({
      content: {
        'application/json': {
          schema: {
            type: 'object',
            required: ['emailsToInvite'],
            properties: {
              emailsToInvite: {
                type: 'array',
                minItems: 1,
                default: [],
              },
              playlistId: {
                type: 'string',
                pattern: '^([0-9a-fA-F]{24})$',
                errorMessage: {
                  pattern: customErrorMsg.playlistErrors.INVALID_PLAYLIST_ID,
                },
                default: '',
              },
            },
          },
        },
      },
    })
    payload: {
      emailToInvite: string[];
      playlistId: string;
    },
  ): Promise<any> {
    return this.playlistService.inviteUserToPlaylist({
      payload,
      loggedInUserId: this.userId,
    });
  }

  @del('/playlists/{id}')
  @response(204, {
    description: 'Playlists DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.playlistsRepository.deleteById(id);
  }
}
