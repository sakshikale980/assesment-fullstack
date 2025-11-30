import packageInfo from '../../package.json';
export const environment = {
  appVersion: packageInfo.version,
  production: false,
  BASE_URL: 'http://localhost:9000/',
};



