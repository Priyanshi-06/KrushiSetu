import axios from "axios";
import { BACKEND_BASE_URL } from "../../config/apiBase";

const api = axios.create({
  baseURL: `${BACKEND_BASE_URL}/profile`,
  withCredentials: true,
  xsrfCookieName: 'csrftoken',
  xsrfHeaderName: 'X-CSRFToken',
});

export default api;
