import axios from 'axios';
axios.defaults.withCredentials = true;
const request = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: {
        'Content-type': 'application/json',
    },
});

export const get = async (path, options = {}) => {
    const response = await request.get(path, options);
    return response.data;
};

export const post = async (path, options = {}) => {
    const response = await request.post(path, options);
    return response.data;
};

export const DELETE = async (path, options = {}) => {
    const response = await request.delete(path, options);
    return response.data;
};
export const PUT = async (path, options = {}) => {
    const response = await request.put(path, options);
    return response.data;
};
export default request;
