import { useState } from "react";
import Illustration from "/src/assets/illustration_2.svg";
import { NavLink } from "react-router";

const SignupForm = () => {
  const [isLogin, setIsLogin] = useState(false);

  const toggleForm = () => setIsLogin(!isLogin);

  return (
     <main className="signup-page flex flex-col lg:flex-row rounded-lg overflow-hidden max-w-5xl mx-auto shadow-[7px_7px_0px_4px_rgb(191,64,191)]">
            <div className="illustration-container w-full lg:w-1/2 bg-transparent backdrop-blur-xl backdrop-filter pl-5 border-t-2 border-l-2 border-solid rounded-tl-lg rounded-bl-lg">
            <img src={Illustration} alt="illustration" className="h-full w-full object-contain" />
            </div>
            
            <div className="form-container flex-1 p-8 lg:p-12 bg-white">
              <h1 className="text-3xl font-bold mb-6 text-gray-800">SignUp</h1>
              <form>
                <div className="input-group mb-6">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input type="email" id="email" className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
                </div>
                <div className="input-group mb-6">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input type="password" id="password" className="mt-2 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm" />
                </div>
                <button type="submit" className="w-full py-3 px-4 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out hover:shadow-[5px_5px_0px_0px_rgb(191,64,191)]">
                  SignUp
                </button>
              </form>
              <p className="mt-6 text-center text-gray-600">
          Already have an account?
          <NavLink to="/login" className="ml-2 text-purple-600 hover:text-purple-500 font-medium">
                <button type="button" onClick={toggleForm} className="ml-2 text-purple-600 hover:text-purple-500 font-medium">
                  Login
            </button>
          </NavLink>
              </p>
            </div>
          </main>
    
    
  );
};

export default SignupForm;