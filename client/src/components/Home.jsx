import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import {
  FaCog,
  FaQrcode,
  FaMobileAlt,
  FaMoneyBillWave,
  FaChartLine,
  FaHistory,
} from "react-icons/fa";
import {
  BsCreditCard2Front,
  BsArrowUpCircle,
  BsBank2,
  BsLightningCharge,
  BsChevronRight,
} from "react-icons/bs";
import People from "./People";
import { useNavigate } from "react-router-dom";
import { AJAX } from "../utils/ajax";

const Home = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);
  const [isPinSet, setIsPinSet] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const username = Cookies.get("username");
        const data = await AJAX("/api/getName.php", {
          name_username: username,
        });

        if (data && data.name) {
          // console.log("S", data);
          localStorage.setItem("name", data.name);
          const capitalizedUsername =
            data.name.charAt(0).toUpperCase() + data.name.slice(1);
          setUsername(capitalizedUsername);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };
    const fetchBalance = async () => {
      try {
        const data = await AJAX("/api/getBalance.php");

        if (data && data.balance !== undefined) {
          setBalance(data.balance / 100);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    const checkPinSet = async () => {
      try {
        const data = await AJAX("/api/isPinSet.php");
        if (data && data.code === 0) {
          setIsPinSet(data.pinSet);
        }
      } catch (error) {
        console.error("Error checking PIN status:", error);
      }
    };

    fetchBalance();
    fetchUsername();
    checkPinSet();
  }, []);

  const handleLogout = async () => {
    try {
      // Get cookies
      const username = Cookies.get("username");
      const session_key = Cookies.get("session_key");
      const private_key = Cookies.get("private_key");

      console.log("Logout Payload:", { username, session_key });

      if (!session_key || !username) {
        alert("Session key or username is missing. Unable to log out.");
        return;
      }

      // Send logout request to the backend
      const response = await fetch("/api/logout.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, session_key }),
      });

      const data = await response.json();

      if (data.code === 0) {
        // Clear cookies using js-cookie
        if ("serviceWorker" in navigator) {
          const registrations =
            await navigator.serviceWorker.getRegistrations();
          for (const registration of registrations) {
            await registration.unregister();
            console.log("Service Worker unregistered.");
          }
        }
        Cookies.remove("session_key", { path: "/" });
        Cookies.remove("username", { path: "/" });
        Cookies.remove("private_key", { path: "/" });

        alert("You have been logged out.");
        window.location.href = "/";
      } else {
        alert("An error occurred during logout. Please try again.");
      }
    } catch (error) {
      console.error("Error during logout:", error);
      alert("An error occurred. Please try again later.");
    }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const services = [
    {
      id: 1,
      name: "Mutual Funds",
      icon: <FaChartLine className="text-xl" />,
      bgColor: "bg-blue-500",
    },
    {
      id: 2,
      name: "Fixed Deposit",
      icon: <BsBank2 className="text-xl" />,
      bgColor: "bg-purple-500",
    },
    {
      id: 3,
      name: "Gold Invest",
      icon: <FaMoneyBillWave className="text-xl" />,
      bgColor: "bg-yellow-500",
    },
    {
      id: 4,
      name: "Bill Payment",
      icon: <BsLightningCharge className="text-xl" />,
      bgColor: "bg-green-500",
    },
  ];

  const iconStyle = "text-2xl";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 w-full">
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleDropdown}
          className="text-slate-500 hover:text-black transition duration-300 ease-in-out transform hover:scale-110"
        >
          <FaCog className={iconStyle} />
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10">
            <ul className="py-1">
              <li
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer transition-all rounded-md"
                onClick={() => {
                  if (isPinSet) {
                    console.log("Redirecting to Change PIN page...");
                  } else {
                    navigate("/app/set-pin");
                  }
                }}
              >
                {isPinSet ? "Change PIN" : "Set PIN"}
              </li>
              <li
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer transition-all rounded-md"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      <div className="flex flex-col flex-1 justify-start items-center mt-4">
        <div className="px-4 py-6 max-w-xl mx-auto">
          {/* Welcome Message */}
          <h1 className="text-2xl font-semibold text-gray-800 mb-4">
            Welcome, {username}!
          </h1>

          <div className="relative rounded-2xl bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-xl p-6 overflow-hidden min-w-[90vw]">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm">Available Balance</p>
                <h2 className="text-3xl font-bold mt-1">
                  {balance !== null ? (
                    `₹${balance.toFixed(2)}`
                  ) : (
                    <span className="animate-pulse">--</span>
                  )}
                </h2>
              </div>
              <BsCreditCard2Front className="text-3xl opacity-30" />
            </div>

            <div className="absolute bottom-2 left-6 text-xs tracking-wide text-white/80">
              Secured Wallet
            </div>
            <div className="absolute bottom-1 right-4 text-sm font-mono text-white/70">
              **** **** **** 8421
            </div>
          </div>
        </div>

        <section className="w-full px-4 mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-2 px-1">
            Quick Actions
          </h2>
          <div className="bg-white/80 rounded-2xl shadow-md mx-auto py-3 px-3 border border-blue-300 max-w-4xl">
            <div className="flex justify-between items-center mb-4 px-1"></div>

            <div className="grid grid-cols-4 gap-4">
              <div
                className="flex flex-col items-center text-center cursor-pointer transition-transform hover:scale-105 hover:shadow-xl"
                onClick={() => navigate("/app/scan")}
              >
                <div className="bg-white/80 backdrop-blur-md rounded-full p-4 shadow-lg border border-blue-300">
                  <FaMobileAlt className="text-blue-600 text-xl" />
                </div>
                <p className="mt-2 text-sm text-gray-700">Scan</p>
              </div>

              <div
                className="flex flex-col items-center text-center cursor-pointer transition-transform hover:scale-105 hover:shadow-xl"
                onClick={() => navigate("/app/recieve")}
              >
                <div className="bg-white/80 backdrop-blur-md rounded-full p-4 shadow-lg border border-blue-300">
                  <FaQrcode className="text-green-600 text-xl" />
                </div>
                <p className="mt-2 text-sm text-gray-700">QR</p>
              </div>

              <div
                className="flex flex-col items-center text-center cursor-pointer transition-transform hover:scale-105 hover:shadow-xl"
                onClick={() => navigate("/app/send")}
              >
                <div className="bg-white/80 backdrop-blur-md rounded-full p-4 shadow-lg border border-blue-300">
                  <BsCreditCard2Front className="text-purple-600 text-xl" />
                </div>
                <p className="mt-2 text-sm text-gray-700">UPI</p>
              </div>

              <div
                className="flex flex-col items-center text-center cursor-pointer transition-transform hover:scale-105 hover:shadow-xl"
                onClick={() => navigate("/screenbox")}
              >
                <div className="bg-white/80 backdrop-blur-md rounded-full p-4 shadow-lg border border-blue-300">
                  <BsArrowUpCircle className="text-red-600 text-xl" />
                </div>
                <p className="mt-2 text-sm text-gray-700">Screen</p>
              </div>
            </div>
          </div>
        </section>

        <People />

        <section className="w-full px-3 mb-6">
          <h2 className="text-base font-semibold text-gray-800 mb-3 px-1">
            Manage services
          </h2>

          <div className="bg-white/80 rounded-2xl shadow-sm border border-blue-300 px-4 py-4">
            <div className="grid grid-cols-4 gap-2 text-center">
              {services.map((service) => (
                <div
                  key={service.id}
                  className="flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white hover:shadow-md transition-all rounded-xl py-3"
                  onClick={() => console.log(service.name)} // Replace with actual logic
                >
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow border border-blue-300">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-full ${service.bgColor} text-white`}
                    >
                      {service.icon}
                    </div>
                  </div>
                  <span className="text-xs font-medium text-gray-800 px-2 leading-tight">
                    {service.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full px-3 mb-4">
          <h2 className="text-base font-semibold text-gray-800 mb-3 px-1">
            Transactions
          </h2>
          <div className="bg-white/80 rounded-2xl shadow-sm border border-blue-300 px-2 py-2">
            <button
              className="w-full flex items-center justify-between rounded-xl px-3 py-3 hover:bg-white transition-all duration-300"
              onClick={() => navigate("/app/transactions")}
            >
              <div className="flex items-center">
                <div className="w-12 h-12 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow mr-2">
                  <div className="bg-blue-500 text-white p-2 rounded-full">
                    <FaHistory className="text-lg" />
                  </div>
                </div>
                <span className="text-sm font-medium text-gray-800">
                  See Transaction History
                </span>
              </div>
              <BsChevronRight className="text-gray-500" />
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;
