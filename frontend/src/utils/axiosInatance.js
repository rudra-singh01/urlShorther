import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/",
  timeout: 10000,
  withCredentials:true
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // You can modify request config here (add auth tokens, etc.)
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => {
    // Any status code within the range of 2xx
    return response;
  },
  (error) => {
    let errorMessage = "Something went wrong";

    if (error.response) {
      // The server responded with a status code outside the 2xx range
      const status = error.response.status;
      const data = error.response.data;

      switch (status) {
        case 400:
          errorMessage = data.message || "Bad request";
          break;
        case 401:
          errorMessage = "Unauthorized access";
          // Clear token on 401 errors
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
      // The request was made but no response was received
      errorMessage = "No response from server. Please check your connection";
    } else {
      // Something happened in setting up the request
      errorMessage = error.message;
    }

    // Create a new error with the formatted message
    const formattedError = new Error(errorMessage);
    formattedError.originalError = error;
    formattedError.response = error.response;

    return Promise.reject(formattedError);
  }
);
export default axiosInstance;
