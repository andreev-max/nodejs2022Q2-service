import { UUID_REGEXP } from 'src/constants/regexp';

export function isValidUuid(uuid: string) {
  return !!uuid.match(UUID_REGEXP);
}
