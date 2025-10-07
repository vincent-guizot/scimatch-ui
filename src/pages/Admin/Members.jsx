import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const { user } = useAuth();

  // Fetch members
  const fetchMembers = async () => {
    try {
      const res = await axios("https://sci-server.onrender.com/api/users");
      setMembers(res.data.data);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      if (user.role === "Admin") {
        navigate("/members");
      } else if (user.role === "Member") {
        navigate("/matchmaking");
      }
    }
  }, [navigate, user]);

  // Navigate to Add Member
  const handleAdd = () => {
    navigate("/members/add");
  };

  // Edit member → navigate to /edit/:id
  const handleEdit = (id) => {
    navigate(`/members/edit/${id}`);
  };

  // Delete member with Swal confirmation
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(
          `https://sci-server.onrender.com/api/users/${id}`,
          { method: "DELETE" }
        );

        if (!res.ok) throw new Error("Failed to delete member");

        Swal.fire("Deleted!", "The member has been removed.", "success");
        fetchMembers(); // Refresh data
      } catch (error) {
        Swal.fire("Error!", "Failed to delete member.", "error");
        console.error(error);
      }
    }
  };

  // Info popup
  const handleInfo = (member) => {
    Swal.fire({
      title: `<strong>${member.fullname || member.username}</strong>`,
      html: `
        <div style="text-align:left">
          <p><b>Address:</b> ${member.address || "-"}</p>
          <p><b>Age:</b> ${member.age ?? "-"}</p>
          <p><b>Gender:</b> ${member.gender || "-"}</p>
          <p><b>Religion:</b> ${member.religion || "-"}</p>
          <p><b>Role:</b> ${member.role || "-"}</p>
        </div>
      `,
      imageUrl: member.image || "https://via.placeholder.com/100?text=No+Img",
      imageWidth: 100,
      imageHeight: 100,
      imageAlt: "Profile Image",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 animate-pulse">Loading members...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Members List</h1>
        <button
          onClick={handleAdd}
          className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded shadow-md transition"
        >
          + Add Member
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full text-sm border border-gray-200">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th className="py-3 px-4 border text-left">ID</th>
              <th className="py-3 px-4 border text-left">User</th>
              <th className="py-3 px-4 border text-left">Address</th>
              <th className="py-3 px-4 border text-center">Age</th>
              <th className="py-3 px-4 border text-left">Religion</th>
              <th className="py-3 px-4 border text-left">Gender</th>
              <th className="py-3 px-4 border text-left">Role</th>
              <th className="py-3 px-4 border text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {members.length > 0 ? (
              members.map((member) => (
                <tr
                  key={member.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {/* ID */}
                  <td className="py-3 px-4 border font-medium text-gray-700">
                    {member.id}
                  </td>

                  {/* Image + Username */}
                  <td className="py-3 px-4 border">
                    <div className="flex items-center gap-3">
                      <img
                        src={
                          member.image ||
                          "https://via.placeholder.com/40?text=No+Img"
                        }
                        alt={member.username}
                        className="w-10 h-10 rounded-full object-cover border"
                      />
                      <div>
                        <p className="font-semibold text-gray-800">
                          {member.username}
                        </p>
                        <p className="text-gray-500 text-xs">
                          {member.fullname || "-"}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Address */}
                  <td className="py-3 px-4 border text-gray-700">
                    {member.address || "-"}
                  </td>

                  {/* Age */}
                  <td className="py-3 px-4 border text-center">
                    {member.age ?? "-"}
                  </td>

                  {/* Religion */}
                  <td className="py-3 px-4 border text-gray-700">
                    {member.religion || "-"}
                  </td>

                  {/* Gender */}
                  <td className="py-3 px-4 border text-gray-700">
                    {member.gender || "-"}
                  </td>

                  {/* Role */}
                  <td className="py-3 px-4 border text-gray-700 capitalize">
                    {member.role || "-"}
                  </td>

                  {/* Actions */}
                  <td className="py-3 px-4 border text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        onClick={() => handleInfo(member)}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-1 px-3 rounded transition"
                      >
                        Info
                      </button>
                      <button
                        onClick={() => handleEdit(member.id)}
                        className="bg-yellow-100 hover:bg-yellow-200 text-yellow-700 font-medium py-1 px-3 rounded transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-700 font-medium py-1 px-3 rounded transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  className="text-center py-5 text-gray-500 italic"
                >
                  No members found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Members;
