export enum MESSAGES {
  BAD_REQUEST = 'Bad request. Id is invalid (not uuid)',
  OLD_PASSWORD_WRONG = "oldPasswords don't match.",
  DUBLICATE_DATA = 'This entity with this id has already existed',
  ADDED_SUCCESSFULY = 'Entety has been added successfully to your favorites',
}

export const entityIsNotFound = (type: string, id: string) =>
  `${type} with this id - ${id} is not found`;

export const favIsNotFound = (type: string, id: string) =>
  `${type} with this id - ${id} is not found in your favorites`;
