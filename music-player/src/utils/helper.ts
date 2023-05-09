import { HttpErrors } from "@loopback/rest";
import { customErrorMsg } from "../keys";
import { compare } from 'bcryptjs';
import _ from "lodash";

export const generateRandomString = (length: number)=>{
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz!@#$%^&*';
    let randomString = '';
    for (let i = 0; i < length; i++) {
      const rNum = Math.floor(Math.random() * chars.length);
      randomString += chars.substring(rNum, rNum + 1);
    }
    return randomString;
}

export const checkOldPasswords = async (newPassword:string, oldPassword:string[])=>{
   for(let i = 0; i<oldPassword.length; i++){
    const abc = await compare(newPassword,oldPassword[i]);
    if(abc === true){
      throw new HttpErrors[403](
        customErrorMsg.authErrors.PASSWORD_NOT_ALLOWED
      )
    }
  }
}

export const omitId = async (object:object)=>{
  const omitId = _.omitBy(object,_.isUndefined);
  return omitId;
}




