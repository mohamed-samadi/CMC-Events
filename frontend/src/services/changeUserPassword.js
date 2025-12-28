import axios from "axios";

export const changeUserPassword = async (email, newPassword) => {
    const API_URL = "http://localhost:5001/api/users/changeUserPassword";
    try {
        const response = await axios.post(API_URL, { email, newPassword });
        return response.data;
    }
    catch (error) {
        throw new Error(error.response?.data?.message || "Échec du changement de mot de passe");
    }
};
