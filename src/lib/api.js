import axios from "axios";

const getApi = () => {
  const apiKey = localStorage.getItem("notifiq_api_key");

  console.log(apiKey);
  return axios.create({
    baseURL: "https://notiqe.up.railway.app",
    headers: {
      "Content-Type": "application/json",
      ...(apiKey && { "x-api-key": apiKey }),
    },
  });
};

export default getApi;
