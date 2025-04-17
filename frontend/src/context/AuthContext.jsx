import { createContext, useContext, useState } from "react";
import axiosInstance from "../config/axiosConfig";

const AuthContext = createContext();

const AuthProvider = (props) => {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState(null);


    const initializeAuth = async () => {
        setLoading(true);
        const token= JSON.parse(localStorage.getItem("userToken"))
        if(token){
            try {
                const response = await axiosInstance.post(`/api/user/verify`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                })
                console.log(response);
                
                if(response.statusText === 'OK'){

                    setUser(response.data);
                }
            } catch (error) {
                console.error("Token verification failed:", error);
                setUser(null);
                localStorage.removeItem("userToken");
            } finally {
                setLoading(false);
            }
        } else {
            setUser(null);
            setLoading(false);
        }
    }


    const login = async ({email, password}) => {
        try {
            const config = {
                headers: {"Content-type": "application/json"},
            };
            const {data} = await axiosInstance.post(`/api/user/login`,
                {email, password},
                config
            );
            console.log(data);
            
            localStorage.setItem("userToken", JSON.stringify(data.token));
            localStorage.setItem("userInfo", JSON.stringify(data));
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    const signup = async ({name, email, password, avatar}) => {
        try {
            const config = {
                headers: {"Content-type": "multipart/form-data"},
            };
            const user = new FormData();
            user.append('name', name); 
            user.append('email', email);
            user.append('password', password);
            user.append('avatar', avatar);
    
            const {data} = await axiosInstance.post(`/api/user`,
                user,
                config
            );
            return data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    const logout = async () => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userInfo");
        window.location.href = '/auth';
    }
    return (
        <AuthContext.Provider value={{initializeAuth, user, login, signup, logout, loading, setLoading}}>
            {props.children}
        </AuthContext.Provider>
    )
}

export const useAuthCtx = () => {
    return useContext(AuthContext);
}
export default AuthProvider;