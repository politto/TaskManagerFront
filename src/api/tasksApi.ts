import axiosInstance from "../utils/axios";

export const getAllUserTasks = async () => {
    const res = await axiosInstance.get('/tasks', {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }  
    });
    console.log(res.data);
    
    return res.data;
}

export const createTask = async (title: string, description: string, userId: string, status: string) => {
    const res = await axiosInstance.post('/tasks', {
        title,
        description,
        status,
        userId
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return res.data;
}

export const updateTask = async (id: string, title: string, description: string, userId: string, status: string) => {
    const res = await axiosInstance.patch(`/tasks/${id}`, {
        id,
        title,
        description,
        status,
        userId
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return res.data;
}

export const deleteTask = async (id: string) => {
    const res = await axiosInstance.delete(`/tasks/${id}`, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    });
    return res.data;
}