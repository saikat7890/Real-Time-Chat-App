import { Navigate, Outlet } from "react-router-dom";

export const ProtectRoute = () => {
    console.log("ProtectRoute called");
    
    const user = JSON.parse(localStorage.getItem('userToken'));
    if (!user) {
      return <Navigate to="/auth" replace />;
    } 
    return <Outlet />;
};
export const Redirect = () => {
    console.log("Redirect called");
  
    const user = JSON.parse(localStorage.getItem('userToken'));
    if (user) {
      return <Navigate to='/' replace />;
    }
    return <Outlet />;
};