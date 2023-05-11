import {HttpErrors} from '@loopback/rest';
import {compare} from 'bcryptjs';
import _ from 'lodash';
import {customErrorMsg} from '../keys';

export const generateRandomString = (length: number) => {
  const chars =
    '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz!@#$%^&*';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const rNum = Math.floor(Math.random() * chars.length);
    randomString += chars.substring(rNum, rNum + 1);
  }
  return randomString;
};

export const checkOldPasswords = async (
  newPassword: string,
  oldPassword: string[],
) => {
  for (let i = 0; i < oldPassword.length; i++) {
    const abc = await compare(newPassword, oldPassword[i]);
    if (abc === true) {
      throw new HttpErrors[403](customErrorMsg.authErrors.PASSWORD_NOT_ALLOWED);
    }
  }
};

export const omitId = async (object: object) => {
  const omitId = _.omitBy(object, _.isUndefined);
  return omitId;
};

export const checkArtistDuplication = async (artistArray: string[]) => {
  const arrLength = artistArray.length;
  const uniqueSet = new Set(artistArray);
  if (!(arrLength === uniqueSet.size)) {
    throw new HttpErrors[406](customErrorMsg.trackErrors.DUPLICATE_ARTIST_ID);
  }
};
