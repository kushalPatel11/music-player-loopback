import {HttpErrors} from '@loopback/rest';
import {compare} from 'bcryptjs';
import {readFileSync} from 'fs';
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

// Will check all the old passwords from the array and throws error if new password matches in the array
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

// check whether there are unique ids in the array or not
export const checkDataDuplication = async (dataArray: string[]) => {
  if (dataArray.length !== [...new Set(dataArray)].length) {
    throw new HttpErrors[406](customErrorMsg.commonFunctionErrors.DUPLICATE_ID);
  }
};

// Removes the key: "id" and only returns its value in the form of string[]
export const extractIds = async (data: {id: string}[]): Promise<string[]> => {
  return data.map(item => item.id);
};

export const compareFiles = (file1Path: string, file2Path: string) => {
  const file1Data = readFileSync(file1Path);
  const file2Data = readFileSync(file2Path);

  const checkFile = file1Data.equals(file2Data);

  return checkFile;
};

let filePath = 'C:/Users/HP VICTUS/Pictures/download(1).jpg';
let newFilePath = 'C:/Users/HP VICTUS/Pictures/download(1).pdf';

// console.log(compareFiles(filePath, newFilePath));
