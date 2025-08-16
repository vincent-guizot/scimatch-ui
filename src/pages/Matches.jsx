import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

export default function Matches() {
  const { user } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatches = async () => {
      if (!user) return;

      try {
        // Members see only their own choices
        if (user.role === "member") {
          const res = await axios.get("http://localhost:5000/api/likes", {
            headers: { "x-user": user.id },
          });

          setMatches(
            res.data.map((like) => ({
              userA: "You",
              userB:
                like.LikedUser.username ||
                like.LikedUser.fullname ||
                like.LikedUser.id,
            }))
          );
        } else {
          // Admin & Developer see mutual matches
          const generate = await axios.get(
            "http://localhost:5000/api/matches/generate",
            {
              headers: { "x-user": user.id },
            }
          );
          console.log(generate);
          const res = await axios.get("http://localhost:5000/api/matches", {
            headers: { "x-user": user.id },
          });

          const mutualMatches = res.data.filter((m) => m.UserId1 && m.UserId2);

          setMatches(
            mutualMatches.map((m) => ({
              userA: m.User1.username || m.User1.fullname || m.UserId1,
              userB: m.User2.username || m.User2.fullname || m.UserId2,
            }))
          );
        }
      } catch (err) {
        console.error("Failed to fetch matches:", err);
        setMatches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [user]);

  if (loading) return <p className="p-6 text-center">Loading matches...</p>;

  return (
    <div className="p-6">
      {/* Logo + Title */}
      <div className="flex flex-col items-center mb-6">
        <Link to="/home">
          <img
            src="/logo.png"
            alt="logo"
            className="w-16 h-16 object-contain mb-2"
          />
        </Link>
        <h1 className="text-2xl font-bold">Your Matches</h1>
      </div>

      {/* Matches List */}
      {matches.length === 0 ? (
        <p className="text-center text-gray-500">No matches yet</p>
      ) : (
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
      )}
    </div>
  );
}
