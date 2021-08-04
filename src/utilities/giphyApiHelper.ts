import giphyInitialization from "../setup/axioSetupGiphy";
import { giphyAxiosRequestConfiguration } from "../setup/axioSetupGiphy";
import { map, catchError, take, retryWhen, tap, delay } from "rxjs/operators";
import { defer, Observable, of, Subject } from "rxjs";

const axiosInstance = giphyInitialization(giphyAxiosRequestConfiguration);

const axiosGet = <T>(url: string, queryParams?: object): Observable<T> => {
  return defer(() => axiosInstance.get<T>(url, { params: queryParams })).pipe(
    map((result) => result.data)
  );
};

//

const get = <T>(url: string, queryParams?: object): Observable<T[]> => {
  return axiosGet<T[]>(url,queryParams).pipe(
    take(1),
    retryWhen((err) =>
      err.pipe(
        tap((val) => console.log(`Get Error ${val} and retrying...`)),
        delay(3000),
        take(5)
      )
    )
  ) as Observable<T[]>;
};




export { get };
