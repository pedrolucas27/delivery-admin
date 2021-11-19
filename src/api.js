import axios from 'axios';
export default axios.create({
  baseURL: `https://api-master-pizza.herokuapp.com/`
});
export const API_SOCKET = 'http://localhost:8080'; //https://api-master-pizza.herokuapp.com/';