import { toast } from "react-toastify";
import axiosInstance from "./axiosConfig";

export const handleLoginSuccess = async (credentialResponse) => {
    const token = credentialResponse.credential;

    try {
        const config = {headers: {'Content-Type': 'application/json'}}
        const response = await axiosInstance.post('/api/user/googlesignin', 
        { token },
        config
        )
        console.log(response);
        
        localStorage.setItem("userToken", JSON.stringify(response.data.token));
        localStorage.setItem("userInfo", JSON.stringify(response.data));
        toast.success("Login success")
        window.location.href='/'
        
    } catch (error) {
        console.error(error);
        toast.error(error, "Login Failed");
    }
}
export const handleLoginFailure = (error) => {
    toast.error("Login Failed");
};
