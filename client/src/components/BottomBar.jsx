import { useNavigate } from 'react-router-dom';
import { FaPaperPlane, FaQrcode, FaHistory, FaCog } from 'react-icons/fa'; // Updated import
import { TbMoneybag } from "react-icons/tb";
import { motion } from 'framer-motion';

const BottomBar = () => {
    const navigate = useNavigate();

    return (
        <div className="fixed bottom-0 w-full p-2 ">
            <div className="relative items-center bg-white bg-opacity-20 backdrop-blur-lg grid grid-cols-5 gap-2 p-2 border-t border-gray-300 shadow-md z-50 rounded-xl m-4">
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex flex-col items-center justify-center text-sm text-gray-700 transition"
                    onClick={() => navigate('/app/send')}
                >
                    <div className="flex items-center justify-center">
                        <FaPaperPlane className="text-xl mb-1 transition text-white fill-gray-600" />
                    </div>
                    <span className="text-xs mt-1">Send</span>
                </motion.button>
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex flex-col items-center justify-center text-sm text-gray-600 transition"
                    onClick={() => navigate('/app/recieve')}
                >
                    <div className="flex items-center justify-center">
                        <TbMoneybag className="text-2xl mb-1 transition text-white fill-gray-600" />
                    </div>
                    <span className="text-xs mt-1">Receive</span>
                </motion.button>
                <div className="relative flex justify-center items-center w-full">
                    <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute bottom-0 w-16 h-16 bg-gradient-to-r from-blue-400 via-blue-500 to-purple-600 text-white font-semibold rounded-full flex items-center justify-center shadow-xl transition border-4 border-white"
                        onClick={() => navigate('/app/scan')}
                    >
                        <FaQrcode className="text-2xl transform transition-all" />
                    </motion.button>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex flex-col items-center justify-center text-sm text-gray-600 transition"
                    onClick={() => navigate('/app/status')}
                >
                    <div className="flex items-center justify-center">
                        <FaHistory className="text-xl mb-1 transition text-white fill-gray-600" />
                    </div>
                    <span className="text-xs mt-1">Status</span>
                </motion.button>
                <motion.button 
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex flex-col items-center justify-center text-sm text-gray-700 transition"
                    onClick={() => navigate('/app/settings')} 
                >
                    <div className="flex items-center justify-center">
                        <FaCog className="text-xl mb-1 transition text-white fill-gray-600" /> 
                    </div>
                    <span className="text-xs mt-1">Settings</span> 
                </motion.button>
            </div>
        </div>
    );
};

export default BottomBar;