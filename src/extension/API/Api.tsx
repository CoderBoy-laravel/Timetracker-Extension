import axios from "axios";

const Api = async (
  url: string,
  method: string,
  data: string | null,
  headers: object
) => {
  return axios({
    method: method,
    url: `http://207.244.242.41/api/oauth/${url}`,
    data: data,
    headers: headers,
  })
    .then(function (response) {
      return {
        status: response.status,
        data: response.data,
      };
    })
    .catch(function (error) {
      return {
        status: error.status,
        data: error.response,
      };
    });
};

export default Api;
