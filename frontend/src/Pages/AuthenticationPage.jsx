import React, {  useState } from 'react';
import Login from '../components/Authentication/Login';
import Signup from '../components/Authentication/Signup';
import homeImage from '../assets/Frame.png'

const AuthenticationPage = () => {
  const [activeTab, setActiveTab] = useState('login');

  return (
    <div className='flex h-screen md:mx-12'>
      {/* left */}
      <div className='w-1/2 flex items-center justify-center mx-10'>
        <div className='flex flex-col space-y-3'>
          <h1 className='text-2xl font-semibold'>Welcome to</h1>
          <h1 className='text-4xl font-bold'>My Chat App</h1>
          <h2 className='text-pretty'>Here, we believe that building a strong professional network begins with your participation.</h2>
          <h2 className='text-pretty'>We are delighted to offer a modern and user-friendly service to ensure you have the best experience</h2>
          <img src={homeImage} className='w-full max-w-md h-auto rounded-lg shadow-md object-cover' />
        </div>
      </div>

      {/* right */}
      <div className='w-1/2 flex items-center justify-center mx-3'>
        <div className="w-full max-w-md p-6">
          <div className="flex">
            <button
              className={`w-1/2 py-2 rounded-l-full text-sm font-semibold transition 
                ${activeTab === 'login' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('login')}
            >
              Login
            </button>
            <button
              className={`w-1/2 py-2 rounded-r-full text-sm font-semibold transition 
                ${activeTab === 'signup' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700'}`}
              onClick={() => setActiveTab('signup')}
            >
              Sign Up
            </button>
          </div>

          <div className="mt-7">
            {activeTab === 'login' ? <Login /> : <Signup />}
          </div>
        </div>
      </div>

    </div>
  )
}

export default AuthenticationPage