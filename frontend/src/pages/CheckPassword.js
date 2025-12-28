import { useEffect, useRef } from "react";
import { useSelector , useDispatch } from "react-redux";
import { selectEmailSent, selectEmail } from "../selectores/forgotPasswordSelector";
import { checkCodeEmail } from "../services/checkCodeEmailService";
import { useNavigate } from "react-router-dom";
import CardForm from "../components/CardForm";
import Loader from "../components/Loader";
import {selectIsLoading} from "../selectores/loadingSelector";
import {setLoading} from "../features/loadingSlice";


function CheckPassword() {
  const emailSent = useSelector(selectEmailSent);
  const email = useSelector(selectEmail);
  const codeRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isLoading = useSelector(selectIsLoading);
  //  Protect route properly
  useEffect(() => {
    if (!emailSent) {
      navigate("/ForgotPassword");
    }
  }, [emailSent, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const code = codeRef.current.value.trim();

    if (!/^\d{4}$/.test(code)) {
      alert("Le code doit contenir exactement 4 chiffres");
      return;
    }

    try {
      dispatch(setLoading(true));
      const data = await checkCodeEmail(email, Number(code));
      alert(data.message);
      navigate("/ChangePassword");
    } catch (error) {
      alert(error.message);
    } finally{
      dispatch(setLoading(false));
    }
  };

  if (!emailSent) return null; // avoid flicker

  return (
    <CardForm title="VÉRIFICATION DE L'EMAIL">
      {isLoading && <Loader />} {/*show loader when loading*/}
      <p>Code de vérification envoyé. Vérifiez votre e-mail</p>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          disabled
          value={email}
          className="form-control mb-3"
        />

        <input
          type="text"
          placeholder="XXXX"
          ref={codeRef}
          maxLength={4}
          className="form-control"
        />

        <button type="submit" className="btn btn-primary w-100 mt-3">
          Vérifier
        </button>
      </form>
    </CardForm>
  );
}

export default CheckPassword;
