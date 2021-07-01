import initializeAxios from "../setup/axioSetup";
import { axiosRequestConfiguration } from "../setup/axiosRequestConfig";
import { map, catchError, take, retryWhen, tap, delay } from "rxjs/operators";
import { defer, Observable, of, Subject } from "rxjs";

const axiosInstance = initializeAxios(axiosRequestConfiguration);

const axiosGet = <T>(url: string, queryParams?: object): Observable<T> => {
  return defer(() => axiosInstance.get<T>(url, { params: queryParams })).pipe(
    map((result) => result.data)
  );
};

const axiosPost = <T>(
  url: string,
  body: object,
  queryParams?: object
): Observable<T | void> => {
  return defer(() =>
    axiosInstance.post<T>(url, body, { params: queryParams })
  ).pipe(map((result) => result.data));
};

const axiosPut = <T>(
  url: string,
  body: object,
  queryParams?: object
): Observable<T | void> => {
  return defer(() =>
    axiosInstance.put<T>(url, body, { params: queryParams })
  ).pipe(map((result) => result.data));
};

const axiosPatch = <T>(
  url: string,
  body: object,
  queryParams?: object
): Observable<T | void> => {
  return defer(() =>
    axiosInstance.patch<T>(url, body, { params: queryParams })
  ).pipe(map((result) => result.data));
};

const axiosDeleteR = <T>(url: string, id: number): Observable<T | void> => {
  return defer(() => axiosInstance.delete(`${url}/${id}`)).pipe(
    map((result) => result.data)
  );
};

//

const get = <T>(url: string): Observable<T[]> => {
  return axiosGet<T[]>(url).pipe(
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

//  const post = (url: string, item: (Engineer | Language)):void => {
//      axiosPost(url, item)
//          .pipe(take(1))
//          .subscribe(() => {
//          url === 'engineers' ? engNext(true) : lanNext(true);
//      });
//  };

//  const updateItem = (url :string, item:(Engineer | Language)) => {
//      api.put(url, item)
//          .pipe(take(1))
//          .subscribe(() => {
//              url === 'engineers' ? engNext(true) : lanNext(true);
//          });
//  };

//  const deleteItem = (url: string, id: number): void => {
//      api.delete(url, id)
//          .subscribe(() => {
//              url === 'engineers' ? engNext(true) : lanNext(true);
//          });
//  };

export { get };
