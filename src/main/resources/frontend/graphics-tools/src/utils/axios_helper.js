import axios from 'axios';

export const getUserId = () => {
    return window.localStorage.getItem('user_id');
};
export const setUserId = (id) => {
    window.localStorage.setItem('user_id', id);
};

export const getRole = () => {
    return window.localStorage.getItem('user_role');
};
export const setRole = (role) => {
    window.localStorage.setItem('user_role', role);
};

export const getToken = () => {
    return window.localStorage.getItem('token');
};
export const setToken = (token) => {
    window.localStorage.setItem('token', token);
};

axios.defaults.baseURL = "http://localhost:8080/api/v1";
// axios.defaults.baseURL = "http://192.168.100.46:8080/api/v1";
//axios.defaults.baseURL = "http://192.168.37.174:8080/api/v1";
axios.defaults.headers.post['Content-Type'] = 'application/json';


// header cu token
export const request = (method, url, data) => {

    let headers = {};
    if (getToken() !== null && getToken() !== "null") {
        headers = { 'Authorization': `Bearer ${getToken()}` };
    }

    return axios({
        method: method,
        url: url,
        headers: headers,
        data: data
    });

};

export const requestLite = (method, url, data) => {

    return axios({
        method: method,
        url: url,
        headers: {},
        data: data
    });
};

// header cu token
export const request2 = (method, url, headers, data) => {

    return axios({
        method: method,
        url: url,
        headers: headers,
        data: data
    });
};
export const clearLocalStorage = () => {
    window.localStorage.clear();
}