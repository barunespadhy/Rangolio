import axios from 'axios'
import Config from '../config.json';

const filePostfix = Config.localBackendMode ? ".json" : ""

const getData = (endPoint) => {
  return axios.get(`${Config.baseUrl}/data/${endPoint}${filePostfix}`)
}

export default { getData }