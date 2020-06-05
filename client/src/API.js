
import Axios from 'axios';

export const getAllData = async () => {
    const response = await Axios.get("/api/getAllData");
    return response.data;
}

export const getDrinkDetails = async (drinkId) => {
    const response = await Axios.get("/api/getDrinkDetails/"+drinkId);
    return response.data;
};

export const getRandomDrinkDetails = async () => {
    const response = await Axios.get("/api/getRandomDrinkDetails");
    return response.data;
};

export const getFilteredDrinks = async (filters) => {
    console.log("Send");
    console.log(filters);
    const response = await Axios({
        method: 'post',
        url: '/api/filterDrinkList',
        data: filters
    });
    console.log(response);
    return response.data;
}