import { NavLink , Outlet  } from "react-router-dom" ;
import NavBar from "../components/NavBar";
function DashboardLayout() {
  return (
    <div>
         {/* Sidebar */}
         <div>

         </div>

               {/* Page content */}
      <main >
        <Outlet />
      </main>

    </div>
  )
}

export default DashboardLayout ;
