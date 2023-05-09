import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Playlists} from '../models';
import {PlaylistsRepository} from '../repositories';

export class PlaylistController {
  constructor(
    @repository(PlaylistsRepository)
    public playlistsRepository : PlaylistsRepository,
  ) {}

  @post('/playlists')
  @response(200, {
    description: 'Playlists model instance',
    content: {'application/json': {schema: getModelSchemaRef(Playlists)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Playlists, {
            title: 'NewPlaylists',
            exclude: ['id','createdAt','updatedAt'],
          }),
        },
      },
    })
    playlists: Playlists,
  ): Promise<Playlists> {
    return this.playlistsRepository.create(playlists);
  }

  @get('/playlists/count')
  @response(200, {
    description: 'Playlists model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Playlists) where?: Where<Playlists>,
  ): Promise<Count> {
    return this.playlistsRepository.count(where);
  }

  @get('/playlists')
  @response(200, {
    description: 'Array of Playlists model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Playlists, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Playlists) filter?: Filter<Playlists>,
  ): Promise<Playlists[]> {
    return this.playlistsRepository.find(filter);
  }

  @patch('/playlists')
  @response(200, {
    description: 'Playlists PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Playlists, {partial: true}),
        },
      },
    })
    playlists: Playlists,
    @param.where(Playlists) where?: Where<Playlists>,
  ): Promise<Count> {
    return this.playlistsRepository.updateAll(playlists, where);
  }

  @get('/playlists/{id}')
  @response(200, {
    description: 'Playlists model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Playlists, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Playlists, {exclude: 'where'}) filter?: FilterExcludingWhere<Playlists>
  ): Promise<Playlists> {
    return this.playlistsRepository.findById(id, filter);
  }

  @patch('/playlists/{id}')
  @response(204, {
    description: 'Playlists PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Playlists, {partial: true}),
        },
      },
    })
    playlists: Playlists,
  ): Promise<void> {
    await this.playlistsRepository.updateById(id, playlists);
  }

  @put('/playlists/{id}')
  @response(204, {
    description: 'Playlists PUT success',
    content: {
        'application/json': {
          schema: getModelSchemaRef(Playlists, {
            title: 'NewPlaylists',
            exclude: ['id','createdAt','updatedAt'],
          }),
        },
      },
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() playlists: Playlists,
  ): Promise<void> {
    await this.playlistsRepository.replaceById(id, playlists);
  }

  @del('/playlists/{id}')
  @response(204, {
    description: 'Playlists DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.playlistsRepository.deleteById(id);
  }
}
