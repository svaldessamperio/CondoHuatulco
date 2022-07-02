import axios from "axios";

const gaAPI = axios.create({ baseURL: 'http://192.168.1.75:5000' });


export default gaAPI;