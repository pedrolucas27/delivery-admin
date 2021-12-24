import axios from 'axios';
export default axios.create({
  baseURL: `https://api-master-pizza.herokuapp.com/`
  //baseURL: 'http://192.168.0.110:8080/'
});
export const API_SOCKET = 'https://api-master-pizza.herokuapp.com/';
//export const API_SOCKET = 'http://192.168.0.110:8080/'