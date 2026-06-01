import axios from "axios";

const getApi = () => {
  const token = localStorage.getItem("notifiq_token");

  return axios.create({
    baseURL: "https://notiqe.up.railway.app",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });
};

export default getApi;
