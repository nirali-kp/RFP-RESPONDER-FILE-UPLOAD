// api.js

import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL; // Replace with your actual API base URL

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

const fileUpload = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axiosInstance.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export { fileUpload };
