import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.REACT_APP_API_URL,
  timeout: 10000,
  withCredentials: true
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    let errorMessage = "Something went wrong";

    if (error.response) {
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          errorMessage = data.message || "Bad request";
          break;
        case 401:
          errorMessage = "Unauthorized access";
          localStorage.removeItem('token');
          break;
        case 404:
          errorMessage = data.message || "Resource not found";
          break;
        case 409:
          errorMessage = data.message || "Conflict occurred";
          break;
        case 500:
          errorMessage = "Server error. Please try again later";
          break;
        default:
          errorMessage = data.message || "An error occurred";
      }
    } else if (error.request) {
      errorMessage = "No response from server. Please check your connection";
    } else {
      errorMessage = error.message;
    }

    const formattedError = new Error(errorMessage);
    formattedError.originalError = error;
    formattedError.response = error.response;

    return Promise.reject(formattedError);
  }
);

export default axiosInstance;
