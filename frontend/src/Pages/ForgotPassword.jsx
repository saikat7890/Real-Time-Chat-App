import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../config/axiosConfig';
import { toast } from 'react-toastify';
import { useRef } from "react"

const ForgotPassword = () => {
  const ref = useRef<HTMLInputElement>(null)
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
       const response = await axiosInstance.post(`/api/user/forgotpassword`, {email});
       console.log(response);
       
       if(response.data.status === 'success'){
           toast.success("Password Reset link sent to email")
            navigate('/auth')
       }
    } catch (error) {
        console.error(error);
        toast.error(error.response.data.message)
    }
  };

  return (
    <div className="w-full h-screen bg-gray-300 flex flex-col items-center justify-center px-4">
      <div className="flex flex-col space-y-6 bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <form onSubmit={submitHandler} className="space-y-6">
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700 text-lg font-medium">
              Enter your email to reset your password
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email address"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Send Reset Link
          </button>
        </form>

        <div className="text-center">
          <button
            onClick={() => navigate('/auth')}
            className="text-blue-600 hover:underline transition"
          >
            Back to Login
          </button>
        </div>
      </div>
    </div>

  );
};

export default ForgotPassword;


