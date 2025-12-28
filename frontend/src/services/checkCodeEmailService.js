import axios from "axios";

const API_URL = "http://localhost:5001/api/users/checkCodeEmail";

export const checkCodeEmail = async (email, code) => {
    try {
        const response = await axios.post(API_URL, { email, code });
        return response.data;
    }
    catch (error) {
        throw new Error(error.response?.data?.message || "Échec de la vérification du code email");
    }
};