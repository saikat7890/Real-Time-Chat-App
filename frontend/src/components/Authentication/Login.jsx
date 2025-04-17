import React, { useState } from 'react';
import { useAuthCtx } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { GoogleLogin } from "@react-oauth/google"
import { handleLoginFailure, handleLoginSuccess } from '../../config/googleSignIn';

const Login = () => {

  const [show, setShow] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const {loading, setLoading, login} = useAuthCtx();
  const handleClick = () => setShow(!show);

  const submitHandler = async () => {
    setLoading(true);
    if(!email || !password) {
      toast.error("Please fill all the fields")
      setLoading(false);
      return;
    }
    try {
      const result = await login({email, password});
      
      toast.success("Login success")
      window.location.href='/'
      setLoading(false);
    } catch (error) {
      toast.error(error.response.data.message)
      setLoading(false);
    }
  }

  return (
   <div className="flex flex-col space-y-6">
      <div className="flex flex-col ">
        <input
          id="logInEmail"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="Enter Your Email Address"
          className="px-4 py-2 placeholder-black border shadow rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <div className="relative">
          <input
            id="logInPassword"
            type={show ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter password"
            className="w-full px-4 py-2 pr-20 placeholder-black  border shadow rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="button"
            onClick={handleClick}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 hover:underline"
          >
            {show ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      <button onClick={() => {window.location.href='/forgotpassword'}} className='text-right cursor-pointer transform text-sm text-blue-600 hover:underline'>Forgot password</button>
      
      <button
        onClick={submitHandler}
        disabled={loading}
        className={`w-full mt-4 py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <div className="flex items-center justify-center w-full my-4">
        <div className="w-5 md:w-20 border-t border-gray-300"></div>
        <span className="mx-3 text-gray-500 text-sm font-medium">Or Continue with</span>
        <div className="w-5 md:w-20 border-t border-gray-300"></div>
      </div>

      <div className="flex justify-center gap-4">
        <button className="flex items-center justify-center bg-gray-100 text-gray-700 border rounded-lg py-2 hover:bg-gray-200 p-3">
          <GoogleLogin
            onSuccess={handleLoginSuccess}
            onError={handleLoginFailure}
           /> 

        </button>
        
      </div>
    </div>
  )
}

export default Login
