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


//axios.defaults.baseURL = "http://localhost:8080/api/v1";
axios.defaults.baseURL = "http://192.168.100.38:8080/api/v1";
axios.defaults.headers.post['Content-Type'] = 'application/json';

// request fara header
export const request = (method, url, data) => {
    return axios({
        method: method,
        url: url,
        headers: {},
        data: data
    });
};

// request cu header
export const request2 = (method, url, header, data) => {
    return axios({
        method: method,
        url: url,
        headers: header,
        data: data
    });
};