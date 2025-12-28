import {OrbitProgress} from "react-loading-indicators";
import '../styles/Loader.css' ;

function Loader() {
  return (
    <div className="Loader-container"> 
      <OrbitProgress color="#32cdcdff" size="medium" text="" textColor="" />
    </div>
  )
}

export default Loader ;
