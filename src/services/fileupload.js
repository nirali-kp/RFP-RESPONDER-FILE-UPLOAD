// api.js

import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL; // Replace with your actual API base URL

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

const headers = {
  "Content-Type": "application/json", // Adjust this based on your API requirements
};

const fileUpload = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return axiosInstance.post("/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getResultById = (fileId) => {
  return axiosInstance.get(`/result/5502507a-fca7-4c83-96e5-e220920399bf`, {
    headers,
  });
};

const getStatusById = (fileId) => {
  return axiosInstance.get(`/status/${fileId}`, {
    headers,
  });
};

export { fileUpload, getResultById, getStatusById };
