import React from "react";
import { Link, Outlet } from "react-router-dom";
import { motion } from "framer-motion";

const MemberLayout = () => {
  const handleLogout = () => {
    console.log("User logged out");
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <motion.img
            src="/logo.png"
            alt="logo"
            className="w-16 h-16 object-contain"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <h2 className="text-xl font-semibold">Welcome, Admin</h2>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/matches"
            className="bg-green-700 hover:bg-green-800 text-white py-1 px-3 rounded"
          >
            Matches
          </Link>
          <button
            onClick={handleLogout}
            className="bg-red-300 hover:bg-red-500 text-white py-1 px-3 rounded"
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
