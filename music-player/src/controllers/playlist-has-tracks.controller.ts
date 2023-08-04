import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  del,
  get,
  getModelSchemaRef,
  OperationVisibility,
  param,
  patch,
  post,
  put,
  requestBody,
  response,
  visibility,
} from '@loopback/rest';
import {PlaylistHasTracks} from '../models';
import {PlaylistHasTracksRepository} from '../repositories';

@visibility(OperationVisibility.UNDOCUMENTED)
export class PlaylistHasTracksController {
  constructor(
    @repository(PlaylistHasTracksRepository)
    public playlistHasTracksRepository: PlaylistHasTracksRepository,
  ) {}

  @post('/playlist-has-tracks')
  @response(200, {
    description: 'PlaylistHasTracks model instance',
    content: {
      'application/json': {schema: getModelSchemaRef(PlaylistHasTracks)},
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlaylistHasTracks, {
            title: 'NewPlaylistHasTracks',
            exclude: ['id', 'createdAt', 'updateAt'],
          }),
        },
      },
    })
    playlistHasTracks: Omit<PlaylistHasTracks, 'id'>,
  ): Promise<PlaylistHasTracks> {
    return this.playlistHasTracksRepository.create(playlistHasTracks);
  }

  @get('/playlist-has-tracks/count')
  @response(200, {
    description: 'PlaylistHasTracks model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(PlaylistHasTracks) where?: Where<PlaylistHasTracks>,
  ): Promise<Count> {
    return this.playlistHasTracksRepository.count(where);
  }

  @get('/playlist-has-tracks')
  @response(200, {
    description: 'Array of PlaylistHasTracks model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(PlaylistHasTracks, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(PlaylistHasTracks) filter?: Filter<PlaylistHasTracks>,
  ): Promise<PlaylistHasTracks[]> {
    return this.playlistHasTracksRepository.find(filter);
  }

  @patch('/playlist-has-tracks')
  @response(200, {
    description: 'PlaylistHasTracks PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlaylistHasTracks, {partial: true}),
        },
      },
    })
    playlistHasTracks: PlaylistHasTracks,
    @param.where(PlaylistHasTracks) where?: Where<PlaylistHasTracks>,
  ): Promise<Count> {
    return this.playlistHasTracksRepository.updateAll(playlistHasTracks, where);
  }

  @get('/playlist-has-tracks/{id}')
  @response(200, {
    description: 'PlaylistHasTracks model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(PlaylistHasTracks, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(PlaylistHasTracks, {exclude: 'where'})
    filter?: FilterExcludingWhere<PlaylistHasTracks>,
  ): Promise<PlaylistHasTracks> {
    return this.playlistHasTracksRepository.findById(id, filter);
  }

  @patch('/playlist-has-tracks/{id}')
  @response(204, {
    description: 'PlaylistHasTracks PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(PlaylistHasTracks, {partial: true}),
        },
      },
    })
    playlistHasTracks: PlaylistHasTracks,
  ): Promise<void> {
    await this.playlistHasTracksRepository.updateById(id, playlistHasTracks);
  }

  @put('/playlist-has-tracks/{id}')
  @response(204, {
    description: 'PlaylistHasTracks PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() playlistHasTracks: PlaylistHasTracks,
  ): Promise<void> {
    await this.playlistHasTracksRepository.replaceById(id, playlistHasTracks);
  }

  @del('/playlist-has-tracks/{id}')
  @response(204, {
    description: 'PlaylistHasTracks DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.playlistHasTracksRepository.deleteById(id);
  }
}
