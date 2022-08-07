export interface IUserWithoutPassword {
  id: string;
  login: string;
  version: number;
  createdAt: number;
  updatedAt: number;
}

export interface IUser extends IUserWithoutPassword {
  password: string;
}

export interface IArtist {
  id: string;
  name: string;
  grammy: boolean;
}

export interface IAlbum {
  id: string;
  name: string;
  year: number;
  artistId: string | null;
}

export interface ITrack {
  id: string;
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;
}

export interface IFavorites {
  artists: IArtist[];
  albums: IAlbum[];
  tracks: ITrack[];
}

export type Entity = IUser | IArtist | IAlbum | ITrack;

export interface IFavoritesResponse {
  statusCode: number;
  message: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  login: string;
  userId: string;
}

export interface JwtPayloadWithRefreshToken extends JwtPayload {
  refreshToken: string;
}
