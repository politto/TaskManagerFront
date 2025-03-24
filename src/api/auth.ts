import { mockLogin } from "../mock/user/mockLogin";
import axiosInstance from "../utils/axios";
import instanceMockAxios from "../utils/mock";

export const performLogin = async (email: string, password: string): Promise<{data: any, statusCode: number, isLoading: boolean}> => {


    // perform login
    const res = await axiosInstance.post('/auth/signin', {
        email,
        password
    });

    // handle response and error and loading
    return {data: res.data, statusCode: res.status || 200, isLoading: false};
}