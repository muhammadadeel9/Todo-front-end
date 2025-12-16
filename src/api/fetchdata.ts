import axiosInstance from "./axiosinstance"

export const getTasks = async () => {
    const response = await axiosInstance.get('/tasks/');
    return response.data; // Return the data, not the entire response
}
