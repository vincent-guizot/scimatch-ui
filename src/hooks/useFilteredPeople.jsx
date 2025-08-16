import { useState, useEffect } from "react";

/**
 * Custom hook to filter people based on logged-in user's role and gender
 * Excludes Admins from the list
 * @param {Object} user - logged-in user object
 * @param {Array} peopleData - array of all people from API
 * @returns {Array} filtered people
 */
export default function useFilteredPeople(user, peopleData) {
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    if (!user) {
      setFiltered([]);
      return;
    }

    // Filter out Admins
    const nonAdminPeople = peopleData.filter((p) => p.role !== "Admin");

    // Only filter for Members
    if (user.role === "Member") {
      const targetGender = user.gender === "Male" ? "Female" : "Male";
      setFiltered(nonAdminPeople.filter((p) => p.gender === targetGender));
    } else {
      // Developers see everyone except Admins
      setFiltered(nonAdminPeople);
    }
  }, [user, peopleData]);

  return filtered;
}
