import axios from "axios";

const API_URL = "http://localhost:5001/api/users/sendEmail";

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(API_URL, { email });
        return response.data;
    }
    catch (error) {
        throw new Error(error.response?.data?.message || "Échec de la requête de mot de passe oublié");
    }
};