import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import axiosInstance from './../config/axiosConfig';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('')
  const navigate = useNavigate();
  const {id, token} = useParams();
  // console.log(id, " ", token);
  
  const submitHandler =async (e) => {
    e.preventDefault();
    try {
      if(password !== confirmPassword){
        toast.error("Password and confirm password does not match.");
        return;
      }
      const response = await axiosInstance.post(`api/user/resetpassword/${id}/${token}`, {password});
      if(response.status === 200){
        toast.success(response.data.message);
        // navigate("/auth");
        setTimeout(() => {
          navigate("/auth");
        }, 2000);
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
              Enter Your Password
            </label>
            <input
              type="password"
              value={[password]}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col space-y-2">
            <label className="text-gray-700 text-lg font-medium">
              Enter Your Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Re-Enter Password"
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Change Password
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

export default ResetPassword;
