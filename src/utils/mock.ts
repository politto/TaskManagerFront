import axiosMockAdapter from 'axios-mock-adapter';
import axiosInstance from './axios';

const instanceMockAxios = new axiosMockAdapter(axiosInstance, { delayResponse: 0 });

export default instanceMockAxios;