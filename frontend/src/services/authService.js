import axios from "axios";

export const login = async (email, password) => {
    try {
        const response = await axios.post("http://localhost:5001/api/users", { email, password });  
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || "Login failed");
        //If any part doesn’t exist for example data → returns undefined instead 
        // of error i returning this string "Login failed"
    }   
};

export const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("tokenType");
    localStorage.removeItem("user");
};