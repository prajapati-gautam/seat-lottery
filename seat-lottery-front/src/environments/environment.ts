// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  APIURL  : 'https://www.yocat.net/backend/API/V1/',
  APIURLBACKEND  : 'https://www.yocat.net/backend/',
  BASEURL : 'https://www.yocat.net/',
  _FORMAT:'?_format=json',
  _HAL_FORMAT:'?_format=hal_json',
  SANDBOX_TOKEN : 'Token nohWNv7rIsGbrpyJY7hW88STpR60yJ24',
  SANDBOX_API   : 'https://secure-sandbox.zaffo.com/api/1.0/client/',
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
