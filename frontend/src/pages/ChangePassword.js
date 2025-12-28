import { changeUserPassword } from "../services/changeUserPassword" ;
import { useRef, useState } from "react";
import CardForm from "../components/CardForm";
import { useNavigate } from "react-router-dom";
import { useSelector , useDispatch} from "react-redux";
import { selectEmail , selectEmailSent } from "../selectores/forgotPasswordSelector";
import Loader from "../components/Loader";
import {selectIsLoading} from "../selectores/loadingSelector";
import {setLoading} from "../features/loadingSlice";


function ChangePassword() {
    const [showPassword1, setShowPassword1] = useState(false);
    const [showPassword2, setShowPassword2] = useState(false);
    const email = useSelector(selectEmail);
    const isLoading = useSelector(selectIsLoading);

    const emailSent = useSelector(selectEmailSent);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const passwordRef = useRef('');
    const confirmPasswordRef = useRef('');
    
    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);

        const password = passwordRef.current.value.trim();
        const confirmPassword = confirmPasswordRef.current.value.trim();
        if (password.length < 6) {
            alert("Le mot de passe doit contenir au moins 6 caractères.");
            setLoading(false);
            return;
        }
        if (password !== confirmPassword) {
            alert("Les mots de passe ne correspondent pas.");
            setLoading(false);
            return;
        }
        dispatch(setLoading(true));
        changeUserPassword(email, password)
        .then((data) => {
            alert(data.message);
            navigate('/login');
        })
        .catch((error) => {
            alert(error.message);
        })
        .finally(() => {
           dispatch(setLoading(false));
        });
    }
    if (!emailSent) {
        navigate("/ForgotPassword");
    };
    
  return (
    <CardForm title={'CHANGER LE MOT DE PASSE'}>
        {isLoading && <Loader />} {/*show loader when loading*/}
        <form onSubmit={handleSubmit}>
            <input type="email" disabled value={email} />

            <div className="password-input-container mt-3">
                    <input type={showPassword1 ? 'text' : 'password'}
                    placeholder="Nouveau mot de passe"
                    ref={passwordRef}
                    />
                    <img src={showPassword1 ? './images/hidden.png' :'./images/visible.png'  }
                        onClick={() => setShowPassword1(!showPassword1)}
                        alt="Toggle Password Visibility" className="eye-icon"  />
            </div>
            <div className="password-input-container mt-3">
                    <input type={showPassword2 ? 'text' : 'password'}
                    placeholder="Confirmer mot de passe"
                    ref={confirmPasswordRef}
                    />
                    <img src={showPassword2 ? './images/hidden.png' :'./images/visible.png'  }
                        onClick={() => setShowPassword2(!showPassword2)}
                        alt="Toggle Password Visibility" className="eye-icon"  />
            </div>


     
            <button type="submit" 
            className="btn btn-primary w-100 mt-3"
            >Changer le mot de passe</button>
        </form>
    </CardForm>            
  )
}

export default ChangePassword
