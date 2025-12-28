import '../styles/CardForm.css'

function CardForm({ title ,children }) {
  return (
    <div className="form-conatiner">
        <div className="form">
              <div className="form-header">
                    <h1>{title}</h1>
                </div>

                <div  className="form-body">
                    {children}
                 
                </div>
        </div>
    </div>
  );
}

export default CardForm;
