import axios from 'axios';

const API_KEY = '41179628-58e969b7ad0fef579795633df';
axios.defaults.baseURL = 'https://pixabay.com/api/';
axios.defaults.params = {
  key: API_KEY,
  image_type: 'photo',
  orientation: 'horizontal',
  per_page: 12,
};

export const getImages = async (query, page) => {
  const { data } = await axios.get(`?q=${query}&page=${page}`);
  return data;
};
