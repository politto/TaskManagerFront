import instanceMockAxios from "../../utils/mock";

export const mockLogin = instanceMockAxios.onPost('/login').reply(200, {
    data: {
        id: "dfdf",
        username: "john_doe",
        password: "123456",
    },
    isError: false,
    isLoading: false
});