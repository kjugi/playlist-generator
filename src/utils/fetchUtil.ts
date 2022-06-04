import Cookies from "js-cookie";

export type FetchUtilProps = {
  path: string;
  configProps: RequestInit;
  queryParams?: {[key: string]: string | number | boolean};
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
    const urlObject = new URL(`${baseUrl}${path}`);
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
