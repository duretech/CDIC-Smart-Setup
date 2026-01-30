import axios from "axios";
import { apiUrl } from "./urls";

const instance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache",
    "Strict-Transport-Security": "max-age=31536000",
  },
});
instance.interceptors.request.use(
  (config) => {
    console.log('config>>', config)
    config.headers = {
      Authorization: sessionStorage.getItem("Authorization"),
    };

    if(config.multipart) {
      config.headers = {
        ...config.headers,
        'content-type': 'multipart/form-data',
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    let { response } = error;
    if (!response.data.error) {
      return Promise.resolve(response);
    } else {
      return Promise.reject(error);
    }
  }
);


export const loginApi = (param) => {
  //let subURL ="me?fields=:all,organisationUnits[id],userGroups[id],userCredentials[:all,!user,userRoles[id,name]";
  let subURL = "me?fields=:all,organisationUnits[id,name,displayName],userGroups[id],userCredentials[:all,!user,userRoles[id,name]],attributeValues[value,attribute[id,name]]";
  return axios({
    method: "GET",
    url: `${apiUrl}${subURL}`,
    headers: { Authorization: param },
    // data: param
  }).then((res) => {
    return res;
  });
};

export const multipartPostCall =  (url,param) => {
  return axios({
    method: "POST",
    url: `${apiUrl}${url}`,
    //headers: {...header,...{'Content-Type': 'multipart/form-data' }},
    headers: {'Cache-Control': 'no-cache','Content-Type': 'multipart/form-data', 
    'Content-Security-Policy': 'self',
    'X-Content-Type-Options': 'nosniff',
    'X-XSS-Protection': "1; mode=block" },
    data: param
})
}

export const register = (param,values) => {
  //let subURL ="me?fields=:all,organisationUnits[id],userGroups[id],userCredentials[:all,!user,userRoles[id,name]";
  let subURL = "rtmpro/subscribe/register";
  return axios({
    method: "POST",
    url: `${apiUrl}${subURL}`,
    headers: { Authorization: param },
    data: values
  }).then((res) => {
    return res;
  });
};
export const activate = (param,values) => {
  //let subURL ="me?fields=:all,organisationUnits[id],userGroups[id],userCredentials[:all,!user,userRoles[id,name]";
  let subURL = "rtmpro/subscribe/authorize";
  return axios({
    method: "POST",
    url: `${apiUrl}${subURL}`,
    headers: { Authorization: param },
    data: values
  }).then((res) => {
    return res;
  });
};
export default instance;
