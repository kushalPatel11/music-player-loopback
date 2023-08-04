import {BindingScope, injectable} from '@loopback/core';
import {repository} from '@loopback/repository';
import {HttpErrors} from '@loopback/rest';
import {customErrorMsg} from '../keys';
import {PlaylistsRepository, UsersRepository} from '../repositories';
import {PlaylistHasUsersRepository} from '../repositories/playlist-has-users.repository';
import {checkDataDuplication, generateRandomString} from '../utils/helper';

type createPlaylistParams = {
  payload: {
    name: string;
    description: string;
  };
  createdBy: string;
  updatedBy: string;
  userId: string;
};

type inviteUserToPlaylist = {
  payload: {
    emailToInvite: string[];
    playlistId: string;
  };
  loggedInUserId: string;
};

@injectable({scope: BindingScope.TRANSIENT})
export class PlaylistService {
  constructor(
    @repository(UsersRepository)
    public usersRepository: UsersRepository,
    @repository(PlaylistsRepository)
    public playlistsRepository: PlaylistsRepository,
    @repository(PlaylistHasUsersRepository)
    public playlistHasUsersRepository: PlaylistHasUsersRepository,
  ) {}

  // creates playlist
  async createPlaylist({
    payload,
    createdBy,
    updatedBy,
    userId,
  }: createPlaylistParams) {
    const checkUserId = await this.usersRepository.findOne({
      where: {
        id: userId, 
      },
    });
    if (!checkUserId) {
      throw new HttpErrors[404](customErrorMsg.authErrors.USER_ID_NOT_FOUND);
    }
    const createPlaylist = await this.playlistsRepository.create({
      ...payload,
      createdBy,
      updatedBy,
    });

    return createPlaylist;
  }

  // check whether the email in the array are registered in the database as users
  async validateUsers(inviteEmailsArray: string[]) {
    const users = await this.usersRepository.find({
      where: {
        email: {
          inq: inviteEmailsArray,
        },
        userType: 'user',
      },
    });
    if (inviteEmailsArray.length !== users.length) {
      throw new HttpErrors[406](customErrorMsg.playlistErrors.INVALID_EMAIL_ID);
    }
    return users;
  }

  // invites all the requested users to playlist after the validation
  async inviteUserToPlaylist({payload, loggedInUserId}: inviteUserToPlaylist) {
    let playlistHasUsers: any[] = [];
    const emailArr = payload.emailToInvite;

    if (emailArr.length > 0 && emailArr.includes(loggedInUserId)) {
      throw new HttpErrors.BadRequest(
        'You cannot invite yourself to the playlist!',
      );
    }

    // checks if the logged in user has userType user
    const checkUserId = await this.usersRepository.findOne({
      where: {
        id: loggedInUserId,
        userType: 'user',
      },
    });

    if (!checkUserId) {
      throw new HttpErrors[404](customErrorMsg.authErrors.USER_ID_NOT_FOUND);
    }

    // check if the playlist is registered in the database
    const checkPlaylist = await this.playlistsRepository.findOne({
      where: {
        id: payload.playlistId,
        createdBy: loggedInUserId,
      },
    });

    if (!checkPlaylist) {
      throw new HttpErrors[404](
        customErrorMsg.playlistErrors.PLAYLIST_NOT_FOUND,
      );
    }

    // validate if the emails are repeated in the array
    await checkDataDuplication(emailArr);

    const validatedUsers = await this.validateUsers(emailArr);

    // create an object for each email
    if (validatedUsers.length > 0) {
      validatedUsers.map(user => {
        const eachObj: any = {
          playlistId: checkPlaylist.id,
          userId: user.id,
          invitationToken: generateRandomString(150),
          status: 'pending',
        };
        playlistHasUsers.push(eachObj);
      });
    }

    // store the above object for each invited user
    if (playlistHasUsers.length > 0) {
      await this.playlistHasUsersRepository.createAll(playlistHasUsers);
    }
    console.log('playlistHasUsers:', playlistHasUsers);
  }
}
