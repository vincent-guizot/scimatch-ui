import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MemberLayout = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Link to="/members">
            <motion.img
              src="/logo.png"
              alt="logo"
              className="w-16 h-16 object-contain cursor-pointer"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </Link>
          <h2 className="text-xl font-semibold">Welcome, Admin</h2>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/matchmaking"
            className="bg-blue-700 hover:bg-blue-800 text-white py-1 px-3 rounded"
          >
            Match Making
          </Link>
          <Link
            to="/matches"
            className="bg-green-700 hover:bg-green-800 text-white py-1 px-3 rounded"
          >
            Matches
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-700 hover:bg-red-800 text-white py-1 px-3 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Child pages */}
      <Outlet />
    </div>
  );
};

export default MemberLayout;
