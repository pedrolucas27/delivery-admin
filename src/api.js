import axios from 'axios';
export default axios.create({
  baseURL: `https://api-master-pizza.herokuapp.com/`
});
export const API_SOCKET = 'https://api-master-pizza.herokuapp.com/';