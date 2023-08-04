import {TokenService} from '@loopback/authentication';
import {BindingKey} from '@loopback/core';

export namespace TokenServiceConstants {
  export const TOKEN_SECRET_VALUE = 'myjwts3cr3t';
  export const TOKEN_EXPIRES_IN_VALUE = '21600';
}
export namespace TokenServiceBindings {
  export const TOKEN_SECRET = BindingKey.create<string>(
    'authentication.jwt.secret',
  );
  export const TOKEN_EXPIRES_IN = BindingKey.create<string>(
    'authentication.jwt.expires.in.seconds',
  );
  export const TOKEN_SERVICE = BindingKey.create<TokenService>(
    'services.authentication.jwt.tokenservice',
  );
}

/**
 * Constant values used when generating refresh token.
 */
export namespace RefreshTokenConstants {
  /**
   * The default secret used when generating refresh token.
   */
  export const REFRESH_SECRET_VALUE = 'r3fr35htok3n';
  /**
   * The default expiration time for refresh token.
   */
  export const REFRESH_EXPIRES_IN_VALUE = '216000';
  /**
   * The default issuer used when generating refresh token.
   */
  export const REFRESH_ISSUER_VALUE = 'loopback4';
}

export namespace customErrorMsg {
  export enum authErrors {
    USER_PASSWORD_NOT_SET = 'User does not have password setup.',
    USER_ID_NOT_FOUND = 'User Id not found!',
    WHITESPACE_ERROR = 'White space not allowed before or after the name',
    ENTER_USER_ID = 'Enter User Id',
    INVALID_USER_TYPE = 'Select from "user" or "artist" only',
    INVALID_EMAIL = 'Invalid Email!!',
    EMAIL_ALREADY_EXISTS = 'This email is already registered. Please enter a new email',
    EMAIL_NOT_FOUND = 'Email not found',
    INVALID_DOB_FORMAT = 'Ivalid date of birth format',
    INVALID_PHONE_NUMBER = 'Invalid Phone Number. Exactly 10 digits required in this format "1234567890"',
    INVALID_COUNTRY_CODE = 'Invalid Country Code. Please enter a valid country code',
    PHONE_NUMBER_ALREADY_EXISTS = 'Phone number is already in use. Please sign up using a new phone number',
    INCORRECT_PASSWORD = 'Incorrect Password',
    PASSWORD_VALIDATION_FAILED = 'Must include one uppercase, one lower case, one number, one special character and minimum of 8 characters',
    PASSWORDS_DONT_MATCH = 'Passwords do not match. Please enter same password in both the fields!!',
    PASSWORD_NOT_ALLOWED = 'The entered password has already been used once; Please enter a new password!!',
    PASSWORD_CANT_BE_SAME = 'Old password and new password cannot be same!',
    SESSION_ID_NOT_FOUND = 'session Id not found',
    TOKEN_NOT_FOUND = 'Token not found',
    INVALID_TOKEN = 'Invalid Token!!',
    TOKEN_EXPIRED = 'Your token to reset password has been expired',
    ALREADY_EXPIRED_SESSION = 'Your session has expired. LogIn again to continue!!',
    ALREADY_LOGGED_OUT = 'You have already logged out with this session ID',
  }

  export enum trackErrors {
    EMPTY_TRACK_TITLE = 'Invalid title! Must not be empty and should not contain white space before or after the title',
    INVALID_ARTIST_ID = 'Artist Id must be a valid MongoDB Id!!',
    ARTIST_ID_NOT_FOUND = 'Artist does not exist!',
    LANGUAGE_NOT_ALLOWED = 'Only english and hindi languages are allowed',
    GENRE_NOT_ALLOWED = 'Only rock, pop, jazz, romantic, lofi, spiritual genre are allowed',
    EMPTY_DESCRIPTION = 'Description must not be empty',
    INVALID_FILE_EXTENSION = 'Current file extension not allowed!! Only mp3, WAV and AAc file extensions are allowed!!',
    INVALID_ARTIST_IDS = 'Must contain only artistId and not userId!!',
    LOGGED_IN_USER_ID_REQUIRED = 'Must include logged in userId',
    COLLABORATION_TOKEN_ERROR = 'Invalid Token!',
    COLLABORATION_REQUEST_NOT_FOUND = 'You do not have any collaboration requests over here!!',
    COLLABORATION_REQUEST_ENUM_ERROR = 'Invalid status!! Choose from `accepted` or `rejected` only',
  }

  export enum playlistErrors {
    EMPTY_PLAYLIST_NAME = 'Invalid name! Must not be empty and should not contain white space before or after the name',
    EMPTY_DESCRIPTION = 'Description should not be empty or contain white spaces before or after the description!',
    INVALID_EMAIL_ID = 'Invalid Email! The mentioned email is not registered as user.',
    PLAYLIST_NOT_FOUND = 'Playlist not found!',
    INVALID_PLAYLIST_ID = 'Invalid playlist Id',
  }

  export enum commonFunctionErrors {
    DUPLICATE_ID = 'Ids must be used only once in the array. Duplication of the Id is not allowed!!',
  }
}

export namespace musicPlayerConstant {
  export enum SessionStatus {
    CURRENT = 'current',
    EXPIRED = 'expired',
  }

  export enum AuthStatus {
    SIGN_UP_SUCCESS = 'you have successfully signed up',
    LOG_IN_SUCCESS = 'you have logged in successfully',
    LOG_OUT_SUCCESS = 'you have logged out successfully',
    PASSWORD_CHANGE_SUCCESSFULL = 'Password has been changed successfully!!',
  }

  export enum TrackStatus {
    COLLABORATION_RESPONSE = 'response sent successfully!!',
  }
}
