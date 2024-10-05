import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL;
const API_URL = "https://appmeal-xu5p2zrq7a-uc.a.run.app";

export const fetchData = async (endpoint: string): Promise<any> => {
    try {
        const response = await axios.get(`${API_URL}/${endpoint}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

export const postData = async (endpoint: string, data: any): Promise<any> => {
    try {
        const response = await axios.post(`${API_URL}/${endpoint}`, data);
        return response.data;
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
};

export const updateData = async (endpoint: string, data: any): Promise<any> => {
    try {
        const response = await axios.put(`${API_URL}/${endpoint}`, data);
        return response.data;
    } catch (error) {
        console.error('Error updating data:', error);
        throw error;
    }
};

export const deleteData = async (endpoint: string): Promise<any> => {
    try {
        const response = await axios.delete(`${API_URL}/${endpoint}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting data:', error);
        throw error;
    }
};
