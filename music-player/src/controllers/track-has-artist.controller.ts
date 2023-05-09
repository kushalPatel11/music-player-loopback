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
import {TrackHasArtist} from '../models';
import {TrackHasArtistRepository} from '../repositories';

export class TrackHasArtistController {
  constructor(
    @repository(TrackHasArtistRepository)
    public trackHasArtistRepository : TrackHasArtistRepository,
  ) {}

  @post('/track-has-artists')
  @response(200, {
    description: 'TrackHasArtist model instance',
    content: {'application/json': {schema: getModelSchemaRef(TrackHasArtist)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TrackHasArtist, {
            title: 'NewTrackHasArtist',
            
          }),
        },
      },
    })
    trackHasArtist: TrackHasArtist,
  ): Promise<TrackHasArtist> {
    return this.trackHasArtistRepository.create(trackHasArtist);
  }

  @get('/track-has-artists/count')
  @response(200, {
    description: 'TrackHasArtist model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(TrackHasArtist) where?: Where<TrackHasArtist>,
  ): Promise<Count> {
    return this.trackHasArtistRepository.count(where);
  }

  @get('/track-has-artists')
  @response(200, {
    description: 'Array of TrackHasArtist model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(TrackHasArtist, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(TrackHasArtist) filter?: Filter<TrackHasArtist>,
  ): Promise<TrackHasArtist[]> {
    return this.trackHasArtistRepository.find(filter);
  }

  @patch('/track-has-artists')
  @response(200, {
    description: 'TrackHasArtist PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TrackHasArtist, {partial: true}),
        },
      },
    })
    trackHasArtist: TrackHasArtist,
    @param.where(TrackHasArtist) where?: Where<TrackHasArtist>,
  ): Promise<Count> {
    return this.trackHasArtistRepository.updateAll(trackHasArtist, where);
  }

  @get('/track-has-artists/{id}')
  @response(200, {
    description: 'TrackHasArtist model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(TrackHasArtist, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(TrackHasArtist, {exclude: 'where'}) filter?: FilterExcludingWhere<TrackHasArtist>
  ): Promise<TrackHasArtist> {
    return this.trackHasArtistRepository.findById(id, filter);
  }

  @patch('/track-has-artists/{id}')
  @response(204, {
    description: 'TrackHasArtist PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(TrackHasArtist, {partial: true}),
        },
      },
    })
    trackHasArtist: TrackHasArtist,
  ): Promise<void> {
    await this.trackHasArtistRepository.updateById(id, trackHasArtist);
  }

  @put('/track-has-artists/{id}')
  @response(204, {
    description: 'TrackHasArtist PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() trackHasArtist: TrackHasArtist,
  ): Promise<void> {
    await this.trackHasArtistRepository.replaceById(id, trackHasArtist);
  }

  @del('/track-has-artists/{id}')
  @response(204, {
    description: 'TrackHasArtist DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.trackHasArtistRepository.deleteById(id);
  }
}
