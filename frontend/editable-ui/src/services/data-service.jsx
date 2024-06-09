import axios from 'axios'

const getData = (endPoint) => {
  return axios.get(`/data/${endPoint}.json`)
}

export default { getData }