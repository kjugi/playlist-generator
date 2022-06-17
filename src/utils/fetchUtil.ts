import Cookies from 'js-cookie';

export type QueryParams = {
  [key: string]: string | number | boolean
};

export type FetchUtilProps = {
  path: string;
  configProps: RequestInit;
  queryParams?: QueryParams;
  baseUrl?: string;
}

export enum ErrorCode {
  GeneralError = 400,
  ExpiredATokenError = 401,
  AuthError = 403,
  NotFoundError = 404,
  RateLimitError = 429,
  ServerError = 500,
}

export type ErrorType = {
  error: {
    status: ErrorCode;
    message: string;
  }
}

export const fetchUtil = async <T = any>({
  path,
  configProps,
  queryParams,
  baseUrl = 'https://api.spotify.com/v1/',
}: FetchUtilProps): Promise<T> => {
  const params = new URLSearchParams({
    market: 'US',
    ...queryParams,
  });
  const urlObject = new URL(
    `${baseUrl}${(path[0] === '/') ? path.substring(1) : path}`
  );
  urlObject.search = params.toString();

  const requestFetch = await fetch(urlObject.href, {
    ...configProps,
    headers: {
      'Authorization': `Bearer ${Cookies.get('token')}`
    },
  });

  const jsonResponse = await requestFetch.json() as T | ErrorType;

  if (
    !requestFetch.ok ||
    requestFetch.status in ErrorCode
  ) {
    throw jsonResponse as ErrorType;
  }

  return jsonResponse as T;
};
