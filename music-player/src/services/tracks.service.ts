import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import _ from 'lodash';
import {customErrorMsg, musicPlayerConstant} from '../keys';
import {
  TrackHasArtistRepository,
  TracksRepository,
  UsersRepository,
} from '../repositories';
import {checkDataDuplication, generateRandomString} from '../utils/helper';

type createTrackParams = {
  loggedInUserId: string;
  payload: {
    title: string;
    artistIds: string[];
    description: string;
    fileExtension: string;
    language: string;
    genre: string;
  };
};

type collaborationDecisionParams = {
  payload: {
    collaborationToken: string;
    collaborationStatus: string;
  };
  artistId: string;
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

  // upload track with proper validation
  async createTrack({payload, loggedInUserId}: createTrackParams) {
    const artistArr = payload.artistIds;

    // check whether the logged in userId  is present in the array or not
    if (artistArr.length >= 1 && !artistArr.includes(loggedInUserId)) {
      throw new HttpErrors.BadRequest(
        customErrorMsg.trackErrors.LOGGED_IN_USER_ID_REQUIRED,
      );
    }
    await checkDataDuplication(artistArr);
    await this.checkValidArtistId(artistArr);

    let omitArtistIds = _.omit(payload, ['artistIds']);

    const track = await this.tracksrepository.create(omitArtistIds);
    if (artistArr.length > 0) {
      const trackHasArtistMultiCreatePayload: any[] = [];

      payload.artistIds.map(artistId => {
        const obj = {
          tracksId: track.id,
          artistId,
          collaborationToken: generateRandomString(150),
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

  // validates the collaboration token and updates the collaboration status
  async collaborationDecision({
    payload,
    artistId,
  }: collaborationDecisionParams) {
    const verifyToken = await this.trackHasArtistRepository.findOne({
      where: {
        artistId: artistId,
        collaborationToken: payload.collaborationToken,
      },
    });

    if (!verifyToken) {
      throw new HttpErrors[400](
        customErrorMsg.trackErrors.COLLABORATION_TOKEN_ERROR,
      );
    }

    await this.trackHasArtistRepository.updateById(verifyToken.id, {
      collaborationStatus: payload.collaborationStatus,
    });

    const getTrackData = await this.trackHasArtistRepository.find({
      where: {
        tracksId: verifyToken.tracksId,
      },
    });

    const getArtistAcceptData = await this.trackHasArtistRepository.find({
      where: {
        tracksId: verifyToken.tracksId,
        collaborationStatus: 'accepted',
      },
    });

    if (getTrackData.length === getArtistAcceptData.length) {
      await this.tracksrepository.updateById(verifyToken.tracksId, {
        status: 'published',
      });
    }

    return musicPlayerConstant.TrackStatus.COLLABORATION_RESPONSE;
  }

  // Get list of all the pending requests for collaboration for artist
  async getPendingCollaborationRequests(artistId: string, getStatus: string) {
    // console.log(getStatus);
    const findRequests = await this.trackHasArtistRepository.find({
      where: {
        artistId,
        collaborationStatus: getStatus,
      },
      fields: {
        tracksId: true,
        collaborationToken: true,
      },
    });

    if (!findRequests) {
      throw new HttpErrors[404](
        customErrorMsg.trackErrors.COLLABORATION_REQUEST_NOT_FOUND,
      );
    }

    return findRequests;
  }

  // check whether the id in the array are valid artist Id and not user Id
  async checkValidArtistId(artistArray: string[]) {
    const checkId = await this.usersRepository.count({
      id: {
        inq: artistArray,
      },
      userType: 'artist',
    });
    if (artistArray.length !== checkId.count) {
      throw new HttpErrors[406](customErrorMsg.trackErrors.INVALID_ARTIST_IDS);
    }
  }
}
