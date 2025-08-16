import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Matches() {
  const { user, logout } = useAuth();
  const [memberChoices, setMemberChoices] = useState([]);
  const [mutualMatches, setMutualMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  useEffect(() => {
    fetchMatches();
    // eslint-disable-next-line
  }, [user]);

  const fetchMatches = async () => {
    if (!user) return;

    try {
      if (user.role === "Member") {
        const res = await axios.get("http://localhost:5000/api/likes", {
          headers: { "x-user": user.id },
        });

        setMemberChoices(
          res.data
            .filter((like) => like.UserId === user.id)
            .map((like) => like.likedUser.username)
        );
      } else {
        const res = await axios.get("http://localhost:5000/api/matches", {
          headers: { "x-user": user.id },
        });
        const mutuals = res.data.filter((m) => m.User1Id && m.User2Id);

        setMutualMatches(
          mutuals.map((m) => ({
            userA: m.user1.username || m.user1.fullname || m.User1Id,
            userB: m.user2.username || m.user2.fullname || m.User2Id,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch matches:", err);
      setMemberChoices([]);
      setMutualMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleGenerateMatches = async () => {
    try {
      await axios.get("http://localhost:5000/api/matches/generate", {
        headers: { "x-user": user.id },
      });
      await fetchMatches();
    } catch (err) {
      console.error("Error generating matches:", err);
    }
  };

  const handleDeleteAllMatches = async () => {
    if (
      !window.confirm(
        "⚠️ Are you sure you want to delete ALL likes and matches?"
      )
    )
      return;

    try {
      await axios.delete("http://localhost:5000/api/matches/delete/all", {
        headers: { "x-user": user.id },
      });

      await axios.delete("http://localhost:5000/api/likes/delete/all", {
        headers: { "x-user": user.id },
      });

      alert("✅ All deleted successfully");
      setMutualMatches([]); // clear from state

      // optional: re-fetch matches to ensure fresh data
      // await fetchMatches();
    } catch (err) {
      console.error("Error deleting all matches:", err);
      alert("❌ Failed to delete matches. Check console.");
    }
  };

  if (loading) return <p className="p-6 text-center">Loading matches...</p>;

  return (
    <div className="p-6">
      {/* Logo + Title */}
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
          <button
            onClick={handleLogout}
            className="bg-red-300 hover:bg-red-500 text-white py-1 px-3 rounded"
          >
            Logout
          </button>
        </div>
      </div>

      {user.role === "Member" ? (
        <MemberChoices choices={memberChoices} user={user} />
      ) : (
        <div>
          {/* Action buttons for Admin/Developer */}
          <div className="flex gap-3 mb-4">
            <button
              onClick={handleGenerateMatches}
              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded"
            >
              Generate Matches
            </button>
            <button
              onClick={handleDeleteAllMatches}
              className="bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
            >
              Delete All Matches
            </button>
          </div>

          <MutualMatches matches={mutualMatches} />
        </div>
      )}
    </div>
  );
}

// ------------------------
// Member component
// ------------------------
function MemberChoices({ choices, user }) {
  if (!user) return <p className="text-center text-gray-500">Please log in</p>;
  if (choices.length === 0)
    return (
      <p className="text-center text-gray-500">
        {user.username}, you have no choices yet
      </p>
    );

  return (
    <div>
      <h3 className="text-lg font-bold mb-3">{user.username}’s Choices</h3>
      <ul className="space-y-2">
        {choices.map((name, idx) => (
          <li key={idx} className="p-3 border rounded shadow-sm bg-white">
            {name}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ------------------------
// Admin/Developer component
// ------------------------
function MutualMatches({ matches }) {
  if (matches.length === 0)
    return <p className="text-center text-gray-500">No mutual matches yet</p>;

  return (
    <ul className="space-y-3">
      {matches.map((m, idx) => (
        <li
          key={idx}
          className="flex items-center justify-between p-4 border rounded shadow-sm bg-white"
        >
          <span className="font-semibold">{m.userA}</span>
          <span className="text-red-500 text-xl mx-2">❤️</span>
          <span className="font-semibold">{m.userB}</span>
        </li>
      ))}
    </ul>
  );
}
