import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import useFilteredPeople from "../hooks/useFilteredPeople";

export default function Home() {
  const { user, logout } = useAuth(); // Only get user and logout from context
  const navigate = useNavigate();
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [peopleData, setPeopleData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Redirect if no user in context
  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [navigate, user]);

  // Fetch users from API
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

  // Toggle selection in local state
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

  // Send selected matches to backend
  const handleMatch = async () => {
    if (!user) return;
    try {
      const payload = selectedPeople.map((p) => ({
        userId: user.id,
        likedUserId: p.id,
      }));

      await axios.post(
        "https://scimatch-server.onrender.com/api/likes/create",
        payload
      );

      alert("Matches sent successfully!");
      setSelectedPeople([]); // Clear selections
    } catch (err) {
      console.error("Failed to send matches:", err);
      alert("Failed to send matches");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) return <div className="p-6 text-center">Loading people...</div>;

  return (
    <div className="p-6">
      {/* Logo + Welcome + Logout */}
      <div className="flex flex-col items-center mb-6">
        <img
          src="/logo.png"
          alt="logo"
          className="w-16 h-16 object-contain mb-2"
        />
        <h2 className="text-lg font-bold">
          Welcome, {user?.username || "Guest"}
        </h2>
        <p className="text-gray-600 mb-2">Pilih 3 orang pilihan mu</p>
        <button
          onClick={handleLogout}
          className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded"
        >
          Logout
        </button>
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
                  ? "bg-stone-50"
                  : "hover:bg-gray-50"
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
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        Show Matches
      </button>
    </div>
  );
}
