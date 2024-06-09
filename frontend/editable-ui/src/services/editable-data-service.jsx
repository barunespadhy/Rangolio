import axios from 'axios';

axios.interceptors.request.use(config => {
  const token = document.cookie.split(';').find(c => c.trim().startsWith('csrftoken='));
  if (token) {
    config.headers['X-CSRFToken'] = token.split('=')[1];
  }
  return config;
}, error => {
  return Promise.reject(error);
});

const getData = (endPoint) => {
  return axios.get(endPoint);
};

const updateData = (endPoint, data) => {
  return axios.patch(endPoint, data);
};

const createData = (endPoint, data) => {
  return axios.post(endPoint, data);
};

const deleteData = (endPoint) => {
  return axios.delete(endPoint);
};

export default { getData, updateData, createData, deleteData };