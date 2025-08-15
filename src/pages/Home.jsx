import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import peopleData from "../data/people";

export default function Home() {
  const { addMatch, matches } = useAuth();
  const navigate = useNavigate();
  const [selectedPeople, setSelectedPeople] = useState([]);

  const toggleSelect = (person) => {
    const alreadySelected = selectedPeople.includes(person);

    // Prevent selecting more than 3 in total (matches + selected)
    if (!alreadySelected && matches.length + selectedPeople.length >= 3) {
      alert("You can only select up to 3 matches.");
      return;
    }

    if (alreadySelected) {
      setSelectedPeople(selectedPeople.filter((p) => p !== person));
    } else {
      setSelectedPeople([...selectedPeople, person]);
    }
  };

  const handleMatch = () => {
    selectedPeople.forEach((person) => addMatch(person));
    navigate("/matches");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">People</h1>
      <div className="grid grid-cols-2 gap-4">
        {peopleData.map((person) => (
          <div
            key={person.id}
            onClick={() => toggleSelect(person)}
            className={`flex items-center gap-4 p-4 border rounded cursor-pointer transition ${
              selectedPeople.includes(person) ? "bg-red-100" : "hover:bg-gray-50"
            }`}
          >
            <img
              src={person.image}
              alt={person.name}
              className="w-16 h-16 object-cover rounded-full border"
            />
            <div>
              <p className="font-semibold">{person.name}</p>
              <p className="text-sm text-gray-500">{person.location}</p>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={handleMatch}
        disabled={selectedPeople.length < 1}
        className={`mt-6 w-full py-2 px-4 rounded text-white ${
          selectedPeople.length < 1
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
        }`}
      >
        Show Matches
      </button>
    </div>
  );
}
