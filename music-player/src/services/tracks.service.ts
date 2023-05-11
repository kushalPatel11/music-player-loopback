import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import _ from 'lodash';
import {
  TrackHasArtistRepository,
  TracksRepository,
  UsersRepository,
} from '../repositories';
import {checkArtistDuplication} from '../utils/helper';

type createTrackParams = {
  payload: {
    title: string;
    artistIds: string[];
    description: string;
    fileExtension: string;
    language: string;
    genre: string;
  };
};

@injectable({scope: BindingScope.TRANSIENT})
export class TracksService {
  constructor(
    @repository(TracksRepository)
    public tracksrepository: TracksRepository,
    @repository(TrackHasArtistRepository)
    public trackHasArtistRepository: TrackHasArtistRepository,
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
  ) {}

  async createTrack({payload}: createTrackParams) {
    const artistArr = payload.artistIds;

    // check whether there are unique ids in the array or not
    await checkArtistDuplication(artistArr);

    let omitArtistIds = _.omit(payload, ['artistIds']);

    const track = await this.tracksrepository.create(omitArtistIds);

    if (artistArr.length > 0) {
      const trackHasArtistMultiCreatePayload: any[] = [];

      payload.artistIds.map(artistId => {
        const obj = {
          tracksId: track.id,
          artistId,
        };
        trackHasArtistMultiCreatePayload.push(obj);
      });

      if (trackHasArtistMultiCreatePayload.length > 0) {
        await this.trackHasArtistRepository.createAll(
          trackHasArtistMultiCreatePayload,
        );
      }
    }

    return track;
  }

  async updateTrack(trackId: string) {}
}
