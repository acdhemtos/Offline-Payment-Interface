import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Illustration from "/src/assets/illustration.png";

const LoginSignupForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const { username, password } = form;
    if (username === "user" && password === "1234") {
      navigate("/app/home");
    } else {
      alert("Invalid username or password");
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
          Login
        </h1>
        <form onSubmit={handleLogin}>
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
              name="username"
              value={form.username}
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
              name="password"
              value={form.password}
              onChange={handleChange}
              className="mt-2 block w-full px-4 py-2 lg:py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 lg:py-3 px-4 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out hover:shadow-[5px_5px_0px_0px_rgb(191,64,191)]"
          >
            Login
          </button>
        </form>
        <p className="mt-4 lg:mt-6 text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <NavLink
            to={"/account/signup"}
            className="ml-1 text-purple-600 hover:text-purple-500 font-medium"
          >
            <button
              type="button"
              onClick={toggleForm}
              className="ml-1 text-purple-600 hover:text-purple-500 font-medium"
            >
              Signup
            </button>
          </NavLink>
        </p>
      </div>
    </main>
  );
};

export default LoginSignupForm;