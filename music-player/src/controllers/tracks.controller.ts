import {authenticate} from '@loopback/authentication';
import {authorize} from '@loopback/authorization';
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
  param,
  post,
  requestBody,
  response
} from '@loopback/rest';
import {Tracks} from '../models';
import {TracksRepository} from '../repositories';

@authenticate('jwt')
@authorize({
  allowedRoles: ['artist'],
})
export class TracksController {
  constructor(
    @repository(TracksRepository)
    public tracksRepository : TracksRepository,
  ) {}

  @post('/tracksUpload')
  @response(200, {
    description: 'Tracks model instance',
    content: {'application/json': {schema: getModelSchemaRef(Tracks)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Tracks, {
            title: 'NewTracks',
            exclude: ['id','createdAt','updatedAt'],
          }),
        },
      },
    })
    tracks: Tracks,
  ): Promise<Tracks> {
    return this.tracksRepository.create(tracks);
  }

  @get('/tracks/count')
  @response(200, {
    description: 'Tracks model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Tracks) where?: Where<Tracks>,
  ): Promise<Count> {
    return this.tracksRepository.count(where);
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
  async find(
    @param.filter(Tracks) filter?: Filter<Tracks>,
  ): Promise<Tracks[]> {
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
    @param.filter(Tracks, {exclude: 'where'}) filter?: FilterExcludingWhere<Tracks>
  ): Promise<Tracks> {
    return this.tracksRepository.findById(id, filter);
  }

  @del('/tracks/{id}')
  @response(204, {
    description: 'Tracks DELETE success',
  })
  async deleteById(
    @param.path.string('id') id: string
    ): Promise<void> {
    await this.tracksRepository.deleteById(id);
  }
}
