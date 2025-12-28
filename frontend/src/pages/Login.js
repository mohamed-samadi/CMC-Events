import { useForm } from "react-hook-form";
import CardForm from "../components/CardForm";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import { loginSuccess , loginFailure } from "../features/authenticationSlice";
import { useDispatch , useSelector} from "react-redux";
import { selectAuthError } from "../selectores/authSelector";
import Loader from "../components/Loader";
import {selectIsLoading} from "../selectores/loadingSelector";
import {setLoading} from "../features/loadingSlice";
function Login() {

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const authError = useSelector(selectAuthError);
    const isLoading = useSelector(selectIsLoading);
  const {
    register, // register form inputs
    handleSubmit, // handle form submission
    formState: { errors, isSubmitting }, // handle errors and submit state
  } = useForm();

  const onSubmit = (data) => {
    // data is object containing form values

    dispatch(setLoading(true)); //set loading to true when starting login
    login(data.email, data.password) //waiting for the promise to be resolved
      .then((userData) => {
        
        localStorage.setItem("token", userData.token);
        localStorage.setItem("tokenType", userData.tokenType);
        localStorage.setItem("user", JSON.stringify(userData.user));
        dispatch(loginSuccess(userData.user));
        navigate('/Home');
      })
      .catch((error) => {
        // console.error( error.message);
        dispatch(loginFailure(error.message));
         // Dispatch login failure action with error message

      })
      .finally(() => {
        dispatch(setLoading(false)); //set loading to false when login is finished    
      });
      } ;

  return (


    <CardForm  title={'LOGIN'} btnTitle={"login"} isSubmitting={isSubmitting} onSubmit={handleSubmit(onSubmit)}>
    {isLoading && <Loader />} {/*show loader when loading*/}
        {authError && <div className="error-message">{authError}</div>} {/*show error of login failed*/}
        <form onSubmit={handleSubmit(onSubmit)}>
            {/* Email */}
        <div>
                 <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter votre email"
            {...register("email", {
              required: "L'e-mail est requis",
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                message: "Adresse e-mail invalide",
              },
            })}
          />
        </div>
          {errors.email && <span className="error-message">{errors.email.message}</span>}

          {/* Password */}
        <div>
              <label htmlFor="password">Password:</label>
            <div className="password-input-container">
                 <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter votre mot de passe"
            {...register("password", {
              required: "Mot de passe est requis",
              pattern: {
                value: /^\S{8,}$/,
                message: "Mot de passe invalide (au moins 8 caractères, pas d'espaces)",
              },
            })}
          />
             <img src={showPassword ? './images/hidden.png' :'./images/visible.png'  }
             onClick={() => setShowPassword(!showPassword)}
              alt="Toggle Password Visibility" className="eye-icon"  />

            </div>
        </div>
          {errors.password && <span className="error-message">{errors.password.message}</span>}
        <div className="forgot-password">
            <span onClick={()=>navigate('/ForgotPassword')}>mot de passe oublié</span>
        </div>
        <button type="submit" className="btn btn-primary w-100 mt-3">login</button>
        </form>
    </CardForm>
  );
}

export default Login;
