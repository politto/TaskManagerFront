import { Users } from "../types/Users";
import axiosInstance from "../utils/axios";

export const performLogin = async (email: string, password: string): Promise<{data: any, statusCode: number}> => {
    try {
        // perform login
        const res = await axiosInstance.post('/auth/signin', {
            email,
            password
        });
        return {data: res.data, statusCode: res.status || 200};
    } catch (error: any) {
        // Return error data and status code instead of throwing
        return {
            data: error.response?.data || { message: error.message },
            statusCode: error.response?.status || 500
        };
    }
}

export const getUserDataFromToken = async (): Promise<{data: Users, statusCode: number}> => {
    // let errors be thrown to caller
    const ret = await axiosInstance.get('/auth/verifyToken', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    console.log(ret);
    
    // only return data and status code
    return {data: ret.data, statusCode: ret.status || 200};
}

export const performRegister = async (email: string, password: string): Promise<{data: any, statusCode: number}> => {
    try {
        // perform register
        const res = await axiosInstance.post('/auth/signup', {
            email,
            password
        });
        return {data: res.data, statusCode: res.status || 200};
    } catch (error: any) {
        // Return error data and status code instead of throwing
        return {
            data: error.response?.data || { message: error.message },
            statusCode: error.response?.status || 500
        };
    }
}
