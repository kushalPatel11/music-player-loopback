import {inject} from '@loopback/core';
import {repository} from '@loopback/repository';
import {
  OperationVisibility,
  Request,
  ResponseObject,
  RestBindings,
  get,
  response,
  visibility,
} from '@loopback/rest';
import {TracksRepository, UsersRepository} from '../repositories';
/**
 * OpenAPI response for ping()
 */

const PING_RESPONSE: ResponseObject = {
  description: 'Ping Response',
  content: {
    'application/json': {
      schema: {
        type: 'object',
        title: 'PingResponse',
        properties: {
          greeting: {type: 'string'},
          date: {type: 'string'},
          url: {type: 'string'},
          headers: {
            type: 'object',
            properties: {
              'Content-Type': {type: 'string'},
            },
            additionalProperties: true,
          },
        },
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
@visibility(OperationVisibility.DOCUMENTED)
export class PingController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(TracksRepository)
    public tracksRepository: TracksRepository,
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
  ) {}

  // Map to `GET /ping`
  @get('/ping')
  @response(200, PING_RESPONSE)
  async ping(): Promise<object> {
    const repoName = 'tracksRepository'
    const responseData: any = await this[repoName].find({});
    // Reply with a greeting, the current time, the url, and request headers
    return responseData;
  }
}
