export enum MESSAGES {
  BAD_REQUEST = 'Bad request. Id is invalid (not uuid)',
  OLD_PASSWORD_WRONG = "oldPasswords don't match.",
  DUBLICATE_DATA = 'This entity with this id has already existed',
  ADDED_SUCCESSFULY = 'Entety has been added successfully to your favorites',
  USER_NOT_FOUND = 'User with this id is not found',
  ACCESS_DENIED = 'Access denied for you',
  REFRESH_TOKEN_INCORRECT = 'refresh token is incorrect',
}

export const entityIsNotFound = (type: string, id: string) =>
  `${type} with this id - ${id} is not found`;

export const favIsNotFound = (type: string, id: string) =>
  `${type} with this id - ${id} is not found in your favorites`;

export const selectUserWithoutPassword = {
  password: false,
  id: true,
  version: true,
  createdAt: true,
  updatedAt: true,
  login: true,
};

export enum ENTITY_TYPES {
  ARTIST = 'artist',
  ALBUM = 'album',
  TRACK = 'track',
  USER = 'user',
}

export type FavsEntityTypes = 'artists' | 'albums' | 'tracks';

export const LOGGING_LEVELS = {
  error: 0,
  warn: 1,
  log: 2,
  debug: 3,
  verbose: 4,
};
