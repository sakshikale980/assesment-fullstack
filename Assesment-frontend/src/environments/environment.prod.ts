import packageInfo from '../../package.json';

export const environment = {
  appVersion: packageInfo.version,
  production: true,
  // BASE_URL: 'https://beeah-api.cherrype.com/v1/',
  BASE_URL: 'http://localhost:3000/v1/',

};
