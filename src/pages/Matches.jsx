import { useAuth } from "../context/AuthContext";

export default function Matches() {
  const { matches, clearMatches } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Matches</h1>
      {matches.length === 0 ? (
        <p>No matches yet</p>
      ) : (
        <ul className="space-y-2">
          {matches.map((match, idx) => (
            <li key={idx} className="p-3 border rounded">
              {match.name}
            </li>
          ))}
        </ul>
      )}
      {matches.length > 0 && (
        <button
          onClick={clearMatches}
          className="mt-6 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded"
        >
          Clear Matches
        </button>
      )}
    </div>
  );
}
