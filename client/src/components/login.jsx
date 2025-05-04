import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { messages } from "../utils/loadMessages";
import { isLogin } from "../utils/isLogin";
import { setIsConnected } from "../globals";

const LoginSignupForm = () => {
  const [isLoginForm, setIsLoginForm] = useState(true);
  const [form, setForm] = useState({ username: "", password: "" });
  const navigate = useNavigate();

  useEffect(() => {
    const checkLogin = async () => {
      const loggedIn = await isLogin();
      if (loggedIn) {
        navigate("/app/home");
        setIsConnected(true);
      }
    };
    checkLogin();
  }, [navigate]);

  const toggleForm = () => {
    setIsLoginForm(!isLoginForm);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { username, password } = form;

    try {
      const response = await fetch("/api/login.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (!response.ok) {
        console.error(`Server error: ${response.status} ${response.statusText}`);
        alert("An error occurred on the server. Please try again later.");
        return;
      }

      const data = await response.json();
      console.log("Login response:", data);

      if (data.code === 0) {
        // Register Service Worker
        if ("serviceWorker" in navigator) {
          
          navigator.serviceWorker
            .register("/service-worker.js")
            .then((registration) => {
              console.log("Service Worker registered with scope:", registration.scope);
              
              
            })
            .catch((error) => {
              console.error("Service Worker registration failed:", error);
            });
        }

        console.log("Session Key:", data.session_key);

        // Set cookies
        document.cookie = `session_key=${data.session_key}; path=/; max-age=604800;`;
        document.cookie = `username=${username}; path=/; max-age=604800;`;
        document.cookie = `private_key=${data.private_key}; path=/; max-age=604800;`;

        // Store credentials using Credential Management API
        // if (navigator.credentials && window.PasswordCredential) {
        //   const credential = new PasswordCredential({
        //     id: username,
        //     password: data.private_key,
        //     name: "Private Key Credential",
        //   });

        //   navigator.credentials
        //     .store(credential)
        //     .then(() => {
        //       console.log("Private key stored in credentials.");
        //     })
        //     .catch((error) => {
        //       console.error("Error storing private key in credentials:", error);
        //     });
        // }

        // Request Notification Permission
        if ("Notification" in window) {
          Notification.requestPermission()
            .then((permission) => {
              if (permission === "granted") {
                console.log("Notification permission granted.");
              } else {
                console.warn("Notification permission denied.");
              }
            })
            .catch((error) => {
              console.error("Error requesting notification permission:", error);
            });
        }

        alert("Login successful!");
        navigate("/app/home");
      } else {
        console.error("Login failed with code:", data.code);
        alert(messages[data.code - 1] || "Login failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <main className="flex flex-col lg:flex-row rounded-lg overflow-hidden p-4 max-w-5xl mx-auto md:p-0 shadow-[7px_7px_0px_4px_rgb(191,64,191)] min-h-screen lg:h-auto">
      <div className="illustration-container w-full lg:w-1/2 rounded-t-lg border-2 border-solid lg:mb-0 h-64 lg:h-auto">
        <img
          src="/illustration.png"
          alt="illustration"
          className="w-full h-full object-cover rounded-sm"
        />
      </div>

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
          {isLoginForm ? "Don't have an account?" : "Already have an account?"}
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