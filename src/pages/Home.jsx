import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import useFilteredPeople from "../hooks/useFilteredPeople";

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

    if (!alreadySelected && selectedPeople.length >= 3) {
      alert("You can only select up to 3 matches.");
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

      await axios.post("http://localhost:5000/api/likes", payload, {
        headers: { "x-user": user.id },
      });

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
          <img
            src="/logo.png"
            alt="logo"
            className="w-16 h-16 object-contain"
          />
          <div>
            <h2 className="text-lg font-bold">
              Welcome, {user?.username || "Guest"}
            </h2>
            <p className="text-gray-600">Pilih 3 orang pilihan mu</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Show Matches link only for admin/developer */}
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
          {filteredPeople.map((person) => (
            <div
              key={person.id}
              onClick={() => toggleSelect(person)}
              className={`flex items-center gap-4 p-4 rounded cursor-pointer transition ${
                selectedPeople.find((p) => p.id === person.id)
                  ? "bg-red-100"
                  : "hover:bg-red-50"
              }`}
            >
              <div>
                <p className="font-semibold">
                  {person.fullname || person.username}
                </p>
                <p className="text-sm text-gray-500">
                  {person.location || "-"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-6">There's no data</p>
      )}

      {/* Button */}
      <button
        onClick={handleMatch}
        disabled={selectedPeople.length < 1 || filteredPeople.length === 0}
        className={`mt-6 w-full py-2 px-4 rounded text-white ${
          selectedPeople.length < 1 || filteredPeople.length === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-700 hover:bg-red-800"
        }`}
      >
        Show Matches
      </button>
    </div>
  );
}
