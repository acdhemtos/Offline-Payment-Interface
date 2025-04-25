import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { FaCog, FaQrcode, FaMobileAlt, FaUserPlus, FaMoneyBillWave, FaChartLine, FaHistory } from "react-icons/fa";
import { BsCreditCard2Front, BsArrowUpCircle, BsBank2, BsLightningCharge, BsChevronRight } from "react-icons/bs";
import People from "./People"; 
import { NavLink, useNavigate } from "react-router-dom";
import { AJAX } from "../utils/ajax";

const Home = () => {
  const navigate = useNavigate();
  
  // const handleSettingsClick = () => {
  //   navigate("/settings"); // Navigate to the settings page
  // };
  const [username, setUsername] = useState("");
  const [balance, setBalance] = useState(0);
  const [isPinSet, setIsPinSet] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Fetch the username from the API
    const fetchUsername = async () => {
      try {
        const username = Cookies.get("username");
        const data = await AJAX("/api/getName.php", { name_username: username });
    
        if (data && data.name) {
          console.log("S", data);
          localStorage.setItem("name", data.name);
          const capitalizedUsername = data.name.charAt(0).toUpperCase() + data.name.slice(1);
          setUsername(capitalizedUsername);
        }
      } catch (error) {
        console.error("Error fetching username:", error);
      }
    };
    const fetchBalance = async () => {
      try {
        const username = Cookies.get("username");
        const sessionKey = Cookies.get("session_key");
        const response = await fetch("/api/getBalance.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, session_key: sessionKey }),
        });
        const data = await response.json();
        console.log(data);
        if (data && data.balance !== undefined) {
          setBalance(data.balance/100);
        }
      } catch (error) {
        console.error("Error fetching balance:", error);
      }
    };
    const checkPinSet = async () => {
      try {
        const username = Cookies.get("username");
        const sessionKey = Cookies.get("session_key");
        const response = await fetch("/api/isPinSet.php", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ username, session_key: sessionKey }),
        });
        const data = await response.json();
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
  
        console.log("Logout Payload:", { username, session_key }); // Debugging line
  
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
        console.log("Logout response:", data); // Debugging line
    
        if (data.code === 0) {
          // Clear cookies using js-cookie
          Cookies.remove("session_key", { path: "/" });
          Cookies.remove("username", { path: "/" });
          alert("You have been logged out.");
          window.location.href = "/";
        } else {
          alert("An error occurred during logout. Please try again.");
        }
      } catch (error) {
        console.error("Error during logout:", error); // Debugging line
        alert("An error occurred. Please try again later.");
      }
  };
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };


  const services = [
    { id: 1, name: "Mutual Funds", icon: <FaChartLine className="text-xl" />, bgColor: "bg-blue-500" },
    { id: 2, name: "Fixed Deposit", icon: <BsBank2 className="text-xl" />, bgColor: "bg-purple-500" },
    { id: 3, name: "Gold Invest", icon: <FaMoneyBillWave className="text-xl" />, bgColor: "bg-yellow-500" },
    { id: 4, name: "Bill Payment", icon: <BsLightningCharge className="text-xl" />, bgColor: "bg-green-500" }
  ];

  

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 w-full">
      {/* Settings Button */}
      <div className="absolute top-6 right-6">
        <button
          onClick={toggleDropdown}
          className="text-slate-500 hover:text-black transition duration-300 ease-in-out transform hover:scale-110"
        >
          <FaCog className="text-2xl" />
        </button>
        {showDropdown && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
            <ul className="py-1">
              <li
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  if (isPinSet) {
                    alert("Redirecting to Change PIN page...");
                    // Redirect to Change PIN page
                  } else {
                    navigate("/app/set-pin")
                  }
                }}
              >
                {isPinSet ? "Change PIN" : "Set PIN"}
              </li>
              <li
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                onClick={handleLogout}
              >
                Logout
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-col flex-1 justify-start items-center">
        {/* Welcome Message */}
        <div className="mt-20 mb-10 px-6 w-full max-w-md mx-auto">
  <div className="flex gap-4 justify-center">
    <div className="flex-1 bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-md border border-white/20">
      <p className="text-sm font-medium text-black/80">Welcome</p>
      <h2 className="text-xl font-bold text-gray mt-1">Hi, {username}!</h2>
    </div>

    {/* Right Card - Balance */}
    <div className="flex-1 bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-md border border-white/20">
      <p className="text-sm font-medium text-black/80">Your Balance</p>
      <h2 className="text-xl font-bold text-gray mt-1">₹{balance.toFixed(2)}</h2>
    </div>
  </div>
</div>

        
        {/* Google Pay Style Icon Row with Slate Background */}
        <section className="w-full px-4 mb-6">
        <h2 className="text-base font-semibold text-gray-800 mb-2 px-1">Quick Actions</h2>
  <div className="bg-[#f0f0f3] rounded-2xl shadow-md mx-auto py-4 px-4 border border-gray-200 max-w-4xl">
    
    {/* Section Title */}
    <div className="flex justify-between items-center mb-4 px-1">
      
      {/* <button className="text-sm text-blue-600 font-medium hover:underline">View All</button> */}
    </div>

    {/* Grid Icons */}
    <div className="grid grid-cols-4 gap-4">
      
      {/* Scan */}
      <div className="flex flex-col items-center text-center cursor-pointer" onClick={() => navigate("/app/scan")}>
        <div className="bg-white/80 backdrop-blur-md rounded-full p-4 shadow-md border border-gray-200">
          <FaMobileAlt className="text-blue-600 text-xl" />
        </div>
        <p className="mt-2 text-sm text-gray-700">Scan</p>
      </div>

      {/* QR */}
      <div className="flex flex-col items-center text-center cursor-pointer" onClick={() => navigate("/app/recieve")}>
        <div className="bg-white/80 backdrop-blur-md rounded-full p-4 shadow-md border border-gray-200">
          <FaQrcode className="text-green-600 text-xl" />
        </div>
        <p className="mt-2 text-sm text-gray-700">QR</p>
      </div>

      {/* Pay to UPI */}
      <div className="flex flex-col items-center text-center cursor-pointer" onClick={() => navigate("/app/send")}>
        <div className="bg-white/80 backdrop-blur-md rounded-full p-4 shadow-md border border-gray-200">
          <BsCreditCard2Front className="text-purple-600 text-xl" />
        </div>
        <p className="mt-2 text-sm text-gray-700">Pay to UPI</p>
      </div>

      {/* Top-up */}
      <div className="flex flex-col items-center text-center">
        <div className="bg-white/80 backdrop-blur-md rounded-full p-4 shadow-md border border-gray-200">
          <BsArrowUpCircle className="text-red-600 text-xl" />
        </div>
        <p className="mt-2 text-sm text-gray-700">Top-up</p>
      </div>
    </div>
  </div>
</section>


        <People  /> 

        <section className="w-full px-3 mb-6">
  <h2 className="text-base font-semibold text-gray-800 mb-3 px-1">Manage services</h2>

  <div className="bg-[#f5f7ff] rounded-2xl shadow-sm border border-gray-200 px-3 py-6">
    <div className="grid grid-cols-4 gap-2 text-center">
      {services.map((service) => (
        <div
          key={service.id}
          className="flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white hover:shadow-md transition-all rounded-xl py-3"
          onClick={() => console.log(service.name)} // Replace with actual logic
        >
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-white shadow border border-gray-200">
            <div className={`w-8 h-8 flex items-center justify-center rounded-full ${service.bgColor} text-white`}>
              {service.icon}
            </div>
          </div>
          <span className="text-xs font-medium text-gray-800 px-2 leading-tight">{service.name}</span>
        </div>
      ))}
    </div>
  </div>
</section>



        <section className="w-full px-4 mb-4">
        <h2 className="text-base font-semibold text-gray-800 mb-3 px-1">Transactions</h2>
  <div className="bg-[#f5f7ff] rounded-2xl shadow-sm border border-gray-200 px-3 py-2">
    <button 
      className="w-full flex items-center justify-between rounded-xl px-4 py-3 hover:bg-white transition-all duration-300"
      // onClick={handleTransactionHistoryClick}
    >
      <div className="flex items-center">
        <div className="w-12 h-12 flex items-center justify-center bg-white border border-gray-200 rounded-full shadow mr-3">
          <div className="bg-blue-500 text-white p-2 rounded-full">
            <FaHistory className="text-lg" />
          </div>
        </div>
        <span className="text-sm font-medium text-gray-800">See Transaction History</span>
      </div>
      <BsChevronRight className="text-gray-500" />
    </button>
  </div>
</section>


        {/* Additional content can go here */}
        <div className="px-6 w-full max-w-md">
          {/* Recent transactions or other content */}
        </div>
      </div>
    </div>
  );
};

export default Home;