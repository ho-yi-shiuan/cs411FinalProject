import axios from 'axios';
//const base = 'http://localhost:3000/';

axios.defaults.timeout = 2500;
axios.defaults.headers = { "Content-Type": "application/json" };

// user api
const userRequest = axios.create({
    baseURL: "http://localhost:3000/user"
});

// pet api
const petRequest = axios.create({
    baseURL: "http://localhost:3000/pet"
});

// search api
const searchRequest = axios.create({
    baseURL: "http://localhost:3000/search"
});

// upload new pet api
const uploadRequest = axios.create({
    baseURL: "http://localhost:3000/upload"
});

// user api
export const apiUserLogin = data => userRequest.post('/signin', data);

// pet api
export const apiGetPet = () => petRequest.get('/allPets');
export const apiUploadPet = data => petRequest.post( '/',data,{headers: {'Content-Type': 'multipart/form-data'}});

// search api
export const apiSearch = data => searchRequest.get(`/search?filter=${data}`);

//upload new pet api
export const apiGetUploadForm = () => uploadRequest.get('/');