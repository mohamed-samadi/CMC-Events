import CardForm from "../components/CardForm";
import { useRef } from "react";
import {forgotPassword} from "../services/forgotPasswordService";
import {sendEmailSuccess , sendEmailFailure } from "../features/forgotpasswordSlice";
import { useDispatch } from "react-redux";  
import { useSelector } from "react-redux";
import { selectErrorSentEmail } from "../selectores/forgotPasswordSelector";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import {selectIsLoading} from "../selectores/loadingSelector";
import {setLoading} from "../features/loadingSlice";

function ForgotPassword() {
    const navigate = useNavigate();
    const emailRef = useRef('');
    const ErrorSentEmail = useSelector(selectErrorSentEmail);
    const isLoading = useSelector(selectIsLoading);

    const dispatch = useDispatch();


    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(setLoading(true));
        const email = emailRef.current.value.trim()
        const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!validEmail) {
            sendEmailFailure("Veuillez entrer une adresse e-mail valide.");
            return;
        }

        forgotPassword(email)
        .then((data) => {
            alert(data.message);
            dispatch(sendEmailSuccess(email));
            navigate('/CheckPassword');
        })
        .catch((error) => {
            dispatch(sendEmailFailure(error.message));
        }).finally(() => {
            dispatch(setLoading(false));
        });
    };
  return (
    <CardForm title={'MOT DE PASSE OUBLIÉ'}>
        {isLoading && <Loader />} {/*show loader when loading*/}
        <form onSubmit={handleSubmit}>
            <div>
                <p>Envoyer code pour virifier votre compte</p>
                {ErrorSentEmail && <div className="error-message">{ErrorSentEmail}</div> }
                    <input type="email" name="email" id="email" 
                    placeholder="Enter vote email"
                    required
                    ref={emailRef}/>
                    <button type="submit" className="btn btn-primary w-100 mt-4" >Envoyer</button>
                    </div>
                </form>
    </CardForm>
  )
}

export default ForgotPassword
