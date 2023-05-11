import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {TracksRepository,TrackHasArtistRepository} from '../repositories';
import _ from 'lodash';

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
  ) {}

  async createTrack({payload}: createTrackParams) {
    const artistArr = payload.artistIds;
    let omitArtistIds = _.omit(payload,['artistIds']);
    const track = await this.tracksrepository.create(omitArtistIds);
    if(artistArr.length>0){
      const trackHasArtistMultiCreatePayload: any[] = [];
      payload.artistIds.map(artistId => {
        const obj ={
          tracksId: track.id,
          artistId,
        };
        trackHasArtistMultiCreatePayload.push(obj);
      })
      if(trackHasArtistMultiCreatePayload.length>0){
        await this.trackHasArtistRepository.createAll(trackHasArtistMultiCreatePayload);
      };
    };
    return track;
  }

  

}
