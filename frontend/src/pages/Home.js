import {   useSelector } from "react-redux"
import { selectIsAuthenticated , selectUser } from "../selectores/authSelector";  
import { Navigate } from "react-router-dom";
import NavBar from "../components/NavBar";

function Home() {
    // Check for token in localStorage
    const token = localStorage.getItem('token');
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const user = useSelector(selectUser);

    if (!token || !isAuthenticated) {
        return  <Navigate to="/login" replace />;
    };


    return (
        <div>
        <NavBar />  
        {/* { isAuthenticated ? <h1>Welcome back {user.name}!</h1> : <h1>Please log in.</h1> }
        <button onClick={handleLogout}>logout</button> */}
       
        </div>
    ) ;
}

export default Home; 
