import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import useFilteredPeople from "../hooks/useFilteredPeople";
import { motion } from "framer-motion";

export default function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [peopleData, setPeopleData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) navigate("/");
  }, [navigate, user]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(
          "https://scimatch-server.onrender.com/api/users"
        );
        setPeopleData(res.data.data || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
        setPeopleData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredPeople = useFilteredPeople(user, peopleData);

  const toggleSelect = (person) => {
    const alreadySelected = selectedPeople.find((p) => p.id === person.id);

    if (!alreadySelected && selectedPeople.length >= 2) {
      alert("You can only select up to 2 matches.");
      return;
    }

    if (alreadySelected) {
      setSelectedPeople(selectedPeople.filter((p) => p.id !== person.id));
    } else {
      setSelectedPeople([...selectedPeople, person]);
    }
  };

  const handleMatch = async () => {
    if (!user || selectedPeople.length === 0) return;

    try {
      const payload = {
        matches: selectedPeople.map((p) => String(p.id)),
      };

      await axios.post(
        "https://scimatch-server.onrender.com/api/likes",
        payload,
        {
          headers: { "x-user": user.id },
        }
      );

      alert("Matches sent successfully!");
      setSelectedPeople([]);
      navigate("/matches");
    } catch (err) {
      console.error("Failed to send matches:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to send matches");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return <div className="p-6 text-center">Loading people...</div>;

  return (
    <div className="p-6">
      {/* Logo + Welcome + Logout + Matches Link */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          {/* Logo bounce */}
          <motion.img
            src="/logo.png"
            alt="logo"
            className="w-16 h-16 object-contain"
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          <div>
            <h2 className="text-lg font-bold">
              Welcome, {user?.username || "Guest"}
            </h2>
            <p className="text-gray-600">Pilih 2 orang pilihan mu</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {(user?.role === "Admin" || user?.role === "Developer") && (
            <Link
              to="/matches"
              className="bg-green-700 hover:bg-green-800 text-white py-1 px-3 rounded"
            >
              Matches
            </Link>
          )}
          <button
            onClick={handleLogout}
            className="bg-red-300 hover:bg-red-500 text-white py-1 px-3 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {/* People list */}
      {filteredPeople.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {filteredPeople.map((person, idx) => (
            <motion.div
              key={person.id}
              onClick={() => toggleSelect(person)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className={`flex items-center gap-4 p-4 rounded-lg shadow-md cursor-pointer transition ${
                selectedPeople.find((p) => p.id === person.id)
                  ? "bg-red-100"
                  : "hover:bg-red-50"
              }`}
            >
              <img
                src={person.image || "/default-avatar.png"}
                alt={person.fullname || person.username}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div>
                <p className="font-semibold">
                  {person.fullname || person.username}
                </p>
                <p className="text-sm text-gray-500">
                  {person.location || "-"}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">There's no data</p>
      )}

      {/* Button */}
      <motion.button
        onClick={handleMatch}
        disabled={selectedPeople.length < 1 || filteredPeople.length === 0}
        whileHover={{ scale: selectedPeople.length < 1 ? 1 : 1.05 }}
        whileTap={{ scale: selectedPeople.length < 1 ? 1 : 0.95 }}
        className={`mt-6 w-full py-2 px-4 rounded text-white shadow-md ${
          selectedPeople.length < 1 || filteredPeople.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-700 hover:bg-red-800"
        }`}
      >
        Show Matches
      </motion.button>
    </div>
  );
}
