import Config from '../config.json';

const pathPrefix = Config.localBackendMode ? process.env.PUBLIC_URL + "/assets" : Config.baseUrl;

const getMedia = (mediaPath) => {
  return `${pathPrefix}/media/${mediaPath}`;
}

export default { getMedia };