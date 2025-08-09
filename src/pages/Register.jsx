import React, { useState } from 'react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-[calc(100vh-140px)] w-full flex flex-col items-center justify-center bg-white px-4">
      <form className="w-full max-w-md bg-white rounded-lg shadow-none flex flex-col gap-6">
        <div className='mb-10 space-y-4'>
          <h1 className='text-center text-3xl'>Create your Account</h1>
          <p className='text-center text-sm text-gray-500'>Enter your details to register an account.</p>
        </div>
        <div>
          <label htmlFor="username" className="block mb-2 text-base font-medium text-gray-700">
            Username
          </label>
          <Input
            id="username"
            type="text"
            placeholder="Enter your username"
            className="w-full h-10"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 text-base font-medium text-gray-700">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            className="w-full h-10"
            required
          />
        </div>
        <div className="relative">
          <label htmlFor="password" className="block mb-2 text-base font-medium text-gray-700">
            Password
          </label>
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Create a password"
            className="w-full h-10 pr-10"
            required
          />
          <button
            type="button"
            className="absolute right-3 top-[72%] -translate-y-1/2 text-gray-400 hover:text-gray-600"
            onClick={() => setShowPassword(!showPassword)}
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
       
        <Button className="w-full py-6 bg-neutral-900 text-white text-lg rounded-md hover:bg-neutral-800 transition">
          Register
        </Button>
        <div className="text-center text-gray-500 text-base mt-2">
          Already have an account?{' '}
          <Link to="/login" className="underline hover:text-[#181f2a]">
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Register;