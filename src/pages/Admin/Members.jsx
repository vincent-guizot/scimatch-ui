import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDropdownId, setOpenDropdownId] = useState(null); // For mobile dropdown
  const navigate = useNavigate();
  const { user } = useAuth();

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
    if (!user) navigate("/");
  }, [user, navigate]);

  const handleAdd = () => navigate("/members/add");
  const handleEdit = (id) => navigate(`/members/edit/${id}`);

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
        await axios.delete(`https://sci-server.onrender.com/api/users/${id}`);
        Swal.fire("Deleted!", "The member has been removed.", "success");
        fetchMembers();
      } catch (error) {
        Swal.fire("Error!", "Failed to delete member.", "error");
        console.error(error);
      }
    }
  };

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

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 animate-pulse">Loading members...</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Members List</h1>
        <button
          onClick={handleAdd}
          className="bg-gradient-to-r from-green-400 to-green-600 hover:from-green-500 hover:to-green-700 text-white font-semibold py-2 px-4 rounded shadow-lg transition"
        >
          + Add Member
        </button>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white shadow-lg rounded-lg border border-gray-200">
        <table className="min-w-full text-sm">
          <thead className="bg-gradient-to-r from-purple-100 to-purple-200 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Address</th>
              <th className="py-3 px-4 text-center">Age</th>
              <th className="py-3 px-4 text-left">Religion</th>
              <th className="py-3 px-4 text-left">Gender</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr
                key={member.id}
                className="hover:bg-gray-50 transition-colors border-b"
              >
                <td className="py-3 px-4 flex items-center gap-3">
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
                </td>
                <td className="py-3 px-4">{member.address || "-"}</td>
                <td className="py-3 px-4 text-center">{member.age ?? "-"}</td>
                <td className="py-3 px-4">{member.religion || "-"}</td>
                <td className="py-3 px-4">{member.gender || "-"}</td>
                <td className="py-3 px-4 capitalize">{member.role}</td>
                <td className="py-3 px-4 text-center relative">
                  <button
                    onClick={() => toggleDropdown(member.id)}
                    className="text-gray-500 hover:text-gray-700 font-bold text-xl"
                  >
                    &#x22EE;
                  </button>
                  {openDropdownId === member.id && (
                    <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-md z-10">
                      <button
                        onClick={() => handleInfo(member)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Info
                      </button>
                      <button
                        onClick={() => handleEdit(member.id)}
                        className="w-full text-left px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(member.id)}
                        className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {members.map((member) => (
          <div
            key={member.id}
            className="bg-gradient-to-r from-indigo-50 to-indigo-100 shadow-lg rounded-xl p-4 relative overflow-hidden"
          >
            <div className="flex items-center gap-3">
              <img
                src={
                  member.image || "https://via.placeholder.com/50?text=No+Img"
                }
                alt={member.username}
                className="w-12 h-12 rounded-full object-cover border-2 border-indigo-300"
              />
              <div className="flex-1">
                <p className="font-bold text-gray-800">{member.username}</p>
                <p className="text-gray-500 text-sm">
                  {member.fullname || "-"}
                </p>
              </div>

              <div className="relative">
                <button
                  onClick={() => toggleDropdown(member.id)}
                  className="text-gray-600 hover:text-gray-900 font-bold text-xl"
                >
                  &#x22EE;
                </button>
                {openDropdownId === member.id && (
                  <div className="absolute right-0 mt-2 w-36 bg-white shadow-lg rounded-md z-10">
                    <button
                      onClick={() => handleInfo(member)}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Info
                    </button>
                    <button
                      onClick={() => handleEdit(member.id)}
                      className="w-full text-left px-4 py-2 text-sm text-yellow-700 hover:bg-yellow-100"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(member.id)}
                      className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-3 text-gray-700 text-sm space-y-1">
              <p>
                <b>Address:</b> {member.address || "-"}
              </p>
              <p>
                <b>Age:</b> {member.age ?? "-"}
              </p>
              <p>
                <b>Gender:</b> {member.gender || "-"}
              </p>
              <p>
                <b>Religion:</b> {member.religion || "-"}
              </p>
              <p>
                <b>Role:</b> {member.role}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Members;
