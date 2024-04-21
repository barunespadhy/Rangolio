import Config from '../config.json';

const pathPrefix = Config.localBackendMode ? '/public' : Config.baseUrl;

const getMedia = (mediaPath) => {
  return `${pathPrefix}/data/${mediaPath}`;
}

export default { getMedia };