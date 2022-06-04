import Cookies from "js-cookie";

export type QueryParams = {
  [key: string]: string | number | boolean
};

export type FetchUtilProps = {
  path: string;
  configProps: RequestInit;
  queryParams?: QueryParams;
  baseUrl?: string;
}

export const fetchUtil = async <T = any>({
  path,
  configProps,
  queryParams,
  baseUrl = 'https://api.spotify.com/v1/',
}: FetchUtilProps): Promise<T> => {
  try {
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
    })
    return await requestFetch.json();
  } catch (err) {
    return err;
  }
}
