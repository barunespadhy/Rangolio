import axios from 'axios'
import Config from '../config.json';

const jsonPrefix = Config.localBackendMode ? ".json" : ""

const getData = (endPoint) => {
  return axios.get(`${Config.baseUrl}/data/${endPoint}${jsonPrefix}`)
}

export default { getData }