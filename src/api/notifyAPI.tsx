import axios from "axios";

const notifyAPI = axios.create({ baseURL: 'http://192.168.1.75:5007' });


export default notifyAPI;