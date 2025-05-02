import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { AJAX } from "../utils/ajax";
import { messages } from "../utils/loadMessages";

const SignupForm = () => {
  const [formState, setFormState] = useState({
    name: "",
    username: "",
    password: "",
    reenterPassword: "",
  });
  const [validationMessages, setValidationMessages] = useState({
    name: "",
    username: "",
    password: "",
    reenterPassword: "",
  });

  const navigate = useNavigate();

  const formatName = (name) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  const formatUsername = (username) => {
    if (username.length === 0) return username;
    return username.charAt(0).toLowerCase() + username.slice(1);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    let formattedValue = value;

    if (id === "name") {
      formattedValue = formatName(value);
    } else if (id === "username") {
      formattedValue = formatUsername(value);
    }

    setFormState((prevState) => ({ ...prevState, [id]: formattedValue }));
    setValidationMessages((prevState) => ({ ...prevState, [id]: "" }));
  };

  const validateField = async (url, fieldData, fieldName) => {
    try {
      const response = await AJAX(url, fieldData);
      let data = await response.text();
      try {
        data = JSON.parse(data);
      } catch (e) {
        console.error(e);
        setValidationMessages((prev) => ({
          ...prev,
          [fieldName]: "Invalid server response",
        }));
        throw new Error(data);
      }

      if (data.code !== 0) {
        setValidationMessages((prev) => ({
          ...prev,
          [fieldName]: messages[data.code - 1],
        }));
        return false;
      }
      setValidationMessages((prev) => ({ ...prev, [fieldName]: "Valid" }));
      return true;
    } catch (error) {
      console.error(error);
      setValidationMessages((prev) => ({
        ...prev,
        [fieldName]: "Connection Error. Please try again.",
      }));
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedUsername = formState.username.toLowerCase();
    const formattedName = formState.name.toLowerCase();

    if (formState.password !== formState.reenterPassword) {
      setValidationMessages((prevState) => ({
        ...prevState,
        reenterPassword: "Passwords do not match",
      }));
      return;
    } else {
      setValidationMessages((prevState) => ({
        ...prevState,
        reenterPassword: "Valid",
      }));
    }

    const isNameValid = await validateField(
      "/api/isValidName.php",
      { name: formattedName },
      "name"
    );
    const isUsernameValid = await validateField(
      "/api/validateSignupUsername.php",
      { username: formattedUsername },
      "username"
    );
    const isPasswordValid = await validateField(
      "/api/isValidPassword.php",
      { password: formState.password },
      "password"
    );

    if (isUsernameValid && isNameValid && isPasswordValid) {
      console.log("All validations passed successfully!");

      const signupResponse = await AJAX("/api/signup.php", {
        name: formattedName,
        username: formattedUsername,
        password: formState.password,
      });

      const signupData = await signupResponse.text();
      try {
        const parsedSignupData = JSON.parse(signupData);
        if (parsedSignupData.code === 0) {
          console.log("Signup successful!");
          navigate("/");
        } else {
          console.error("Signup failed:", messages[parsedSignupData.code - 1]);
        }
      } catch (e) {
        console.error("Invalid JSON response from signup:", signupData);
      }
    }
  };

  return (
    <main className="flex flex-col lg:flex-row rounded-lg overflow-hidden p-4 max-w-5xl mx-auto md:p-0 shadow-lg min-h-screen lg:h-auto">
      <div className="illustration-container w-full lg:w-1/2 rounded-t-lg border-2 border-solid lg:mb-0 h-64 lg:h-auto">
        <img
          src="/illustration_2.svg"
          alt="illustration"
          className="w-full h-full object-cover rounded-sm"
        />
      </div>

      <div className="form-container flex-1 p-4 lg:p-12 bg-gray-50 h-2/3 lg:h-auto rounded-b-lg">
        <h1 className="text-2xl lg:text-3xl font-bold mb-6 text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-lg">
          Signup
        </h1>
        <form onSubmit={handleSubmit}>
          {["name", "username", "password", "reenterPassword"].map((field) => (
            <div className="input-group mb-4 lg:mb-6" key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-700 capitalize"
              >
                {field}
              </label>
              <input
                type={
                  field === "password" || field === "reenterPassword"
                    ? "password"
                    : "text"
                }
                id={field}
                value={formState[field]}
                onChange={handleChange}
                className={`mt-2 block w-full px-4 py-2 border ${
                  validationMessages[field]
                    ? validationMessages[field] === "Valid"
                      ? "border-green-500"
                      : "border-red-500"
                    : "border-gray-300"
                } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
              />
              {validationMessages[field] &&
                validationMessages[field] !== "Valid" && (
                  <p className="mt-2 text-sm text-red-600">
                    {validationMessages[field]}
                  </p>
                )}
            </div>
          ))}

          <button
            type="submit"
            className="w-full py-2 lg:py-3 px-4 rounded-md text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out"
          >
            Signup
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600">
          Already have an account?
          <NavLink
            to={"/account/login"}
            className="ml-1 text-purple-600 hover:text-purple-500 font-medium"
          >
            Login
          </NavLink>
        </p>
      </div>
    </main>
  );
};

export default SignupForm;
