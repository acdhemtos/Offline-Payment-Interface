import { useState } from "react";
import { NavLink } from "react-router-dom";
import Illustration from "/src/assets/illustration_2.svg";
import { getRelativePath } from "../utils/utils";
import { AJAX } from "../utils/ajax";
import { messages } from "../utils/loadMessages";

const SignupForm = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [formState, setFormState] = useState({
    name: "",
    username: "",
    password: "",
    reenterPassword: ""
  });
  const [message, setMessage] = useState("");

  const toggleForm = () => setIsLogin(!isLogin);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await AJAX('/opi/api/validateUsername.php', { username: formState.username });
      
      let data = await response.text();
      console.log(data);
      data = JSON.parse(data);
      setMessage(messages[data.message-1]);
      console.log(data);
    } catch (error) {
      console.error('Error:', error);
      setMessage('Connection Error.');
    }
  };

  return (
    <main className="flex flex-col lg:flex-row rounded-lg overflow-hidden p-4 max-w-5xl mx-auto md:p-0 shadow-[7px_7px_0px_4px_rgb(191,64,191)] min-h-screen lg:h-auto">
      {/* Illustration Section */}
      <div className="illustration-container w-full lg:w-1/2 rounded-t-lg border-2 border-solid lg:mb-0 h-64 lg:h-auto">
        <img
          src={Illustration}
          alt="illustration"
          className="w-full h-full object-cover rounded-sm"
        />
      </div>

      {/* Form Section */}
      <div className="form-container flex-1 p-4 lg:p-12 bg-gray-50 h-2/3 lg:h-auto rounded-b-lg">
        <h1 className="text-2xl lg:text-3xl font-bold lg:mb-6 text-gray-800 mb-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-lg">
          Signup
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="input-group mb-4 lg:mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={formState.name}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-2 lg:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
          <div className="input-group mb-4 lg:mb-6">
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              id="username"
              value={formState.username}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-2 lg:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
          <div className="input-group mb-4 lg:mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formState.password}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-2 lg:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
          <div className="input-group mb-4 lg:mb-6">
            <label
              htmlFor="reenterPassword"
              className="block text-sm font-medium text-gray-700"
            >
              Re-enter Password
            </label>
            <input
              type="password"
              id="reenterPassword"
              value={formState.reenterPassword}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-2 lg:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 lg:py-3 px-4 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out hover:shadow-[5px_5px_0px_0px_rgb(191,64,191)]"
          >
            Signup
          </button>
        </form>
        {message && <p className="mt-4 lg:mt-6 text-center text-red-600">{message}</p>}
        <p className="mt-4 lg:mt-6 text-center text-gray-600">
          Already have an account?
          <NavLink
            to={getRelativePath("/account/login")}
            className="ml-1 text-purple-600 hover:text-purple-500 font-medium"
          >
            <button
              type="button"
              onClick={toggleForm}
              className="ml-1 text-purple-600 hover:text-purple-500 font-medium"
            >
              Login
            </button>
          </NavLink>
        </p>
      </div>
    </main>
  );
};

export default SignupForm;