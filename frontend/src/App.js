import './App.css';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import "bootstrap/dist/css/bootstrap.min.css";
import ForgotPassword from './pages/ForgotPassword';
import CheckPassword from './pages/CheckPassword';
import ChangePassword from './pages/ChangePassword';
import DashboardLayout from './pages/DashboardLayout';


function App() {

  return (
          <Routes>
            <Route path='/Home' element={<Home/>} />
            <Route path='/login'  element={<Login/>} />
            <Route path='/ForgotPassword'  element={<ForgotPassword/>} />
            <Route path='/CheckPassword'  element={<CheckPassword/>} />
            <Route path='/ChangePassword'  element={<ChangePassword/>} />
            <Route path='/DashboardLayout'  element={<DashboardLayout/>} />
          </Routes>

   
  )
}

export default App
