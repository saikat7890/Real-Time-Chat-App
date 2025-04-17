import React, { useState } from 'react'
import { toast } from 'react-toastify';
import { useAuthCtx } from './../../context/AuthContext';
import { GoogleLogin } from "@react-oauth/google"
import { handleLoginFailure, handleLoginSuccess } from '../../config/googleSignIn';

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmpassword, setConfirmpassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [show, setShow] = useState(false);
  const handleClick = () => setShow(!show);
  
  const {loading, setLoading, signup} = useAuthCtx();

  const submitHandler = async (e) => {
    setLoading(true);
    if(!name || !email || !password || !confirmpassword) {
      toast.error('Please fill all the field.')
      setLoading(false);
      return;
    }
    if(password.length < 5){
      toast.error("Password must contain atleast 5 characters");
      setLoading(false);
      return;
    }
    if(password !== confirmpassword) {
      toast.error("Password do not match")
      setLoading(false)
      return;
    }
    try {
      const result = await signup({name, email, password, avatar});
      
      toast.success("Registration successful")
      setTimeout(() => {
        navigate("/auth");
      }, 2000);
      // window.location.href='/auth'
      setLoading(false);
    } catch (error) {
      console.log(error);
      
      toast.error(error.response.data.message)
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col space-y-6 ">
      <form onSubmit={submitHandler} className='flex flex-col space-y-6'>      
        <div className="flex flex-col">
          <input
            id="first-name"
            type="text"
            placeholder="Enter your name"
            onChange={(e) => setName(e.target.value)}
            required
            className="px-4 py-2 placeholder-black shadow border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <input
            id="email"
            type="email"
            placeholder="Enter Your Email Address"
            onChange={(e) => setEmail(e.target.value)}
            required
            className="px-4 py-2 placeholder-black shadow border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col">
          <div className="relative">
            <input
              id="password"
              type={show ? "text" : "password"}
              placeholder="Enter Password"
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 pr-20 placeholder-black shadow border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleClick}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 hover:underline"
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <div className="relative">
            <input
              id="confirmPassword"
              type={show ? "text" : "password"}
              placeholder="Confirm password"
              onChange={(e) => setConfirmpassword(e.target.value)}
              required
              className="w-full px-4 py-2 pr-20 placeholder-black shadow border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="button"
              onClick={handleClick}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-sm text-blue-600 hover:underline"
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div className="flex flex-col">
          <label className="mb-2 font-medium" htmlFor="pic">Upload your Picture</label>
          <input
            id="pic"
            type="file"
            accept="image/*"
            onChange={(e) => setAvatar(e.target.files[0])}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-600 file:text-white hover:file:bg-blue-700"
          />
        </div>

        <button
          type='submit'
          className={`w-full py-2 mt-3 text-white font-semibold rounded-md bg-blue-600 hover:bg-blue-700 transition ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Signing Up..." : "Sign Up"}
        </button>
      </form>

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

export default Signup 
