import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";

import axios from "axios";

const EditMember = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "", // new password
    fullname: "",
    address: "",
    age: "",
    religion: "",
    gender: "",
    role: "",
    image: "https://placehold.co/300/png",
  });

  const [loading, setLoading] = useState(true);

  const fetchMember = async () => {
    try {
      const res = await axios(
        `https://sci-server.onrender.com/api/users/${id}`
      );
      const data = res.data.data;
      setForm({
        username: data.username || "",
        password: "", // leave blank initially
        fullname: data.fullname || "",
        address: data.address || "",
        age: data.age || "",
        religion: data.religion || "",
        gender: data.gender || "",
        role: data.role || "",
        image: data.image || "https://placehold.co/300/png",
      });
    } catch (error) {
      Swal.fire("Error", "Failed to load member data.", "error");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMember();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await Swal.fire({
      title: "Save changes?",
      text: "Are you sure you want to update this member?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, update it!",
      cancelButtonText: "Cancel",
    });

    if (!result.isConfirmed) return;

    try {
      const payload = { ...form, age: +form.age };
      if (!payload.password) delete payload.password;

      console.log(payload);
      const res = await axios.put(
        `https://sci-server.onrender.com/api/users/${id}`,
        payload, // Axios automatically JSON.stringify
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      Swal.fire("Updated!", "Member data has been updated.", "success");

      navigate("/members"); // navigate to members page after update
    } catch (error) {
      Swal.fire("Error", "Failed to update member.", "error");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 animate-pulse">Loading member data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Member</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Username */}
        <div>
          <label className="block text-sm font-semibold mb-1">Username</label>
          <input
            type="text"
            name="username"
            value={form.username}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
            placeholder="Enter username"
            required
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold mb-1">
            Password (leave blank to keep)
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
            placeholder="Enter new password"
          />
        </div>

        {/* Fullname */}
        <div>
          <label className="block text-sm font-semibold mb-1">Fullname</label>
          <input
            type="text"
            name="fullname"
            value={form.fullname}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
            placeholder="Enter full name"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold mb-1">Address</label>
          <input
            type="text"
            name="address"
            value={form.address}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
            placeholder="Enter address"
          />
        </div>

        {/* Age */}
        <div>
          <label className="block text-sm font-semibold mb-1">Age</label>
          <input
            type="number"
            name="age"
            value={form.age}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
            placeholder="Enter age"
          />
        </div>

        {/* Religion */}
        <div>
          <label className="block text-sm font-semibold mb-1">Religion</label>
          <input
            type="text"
            name="religion"
            value={form.religion}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
            placeholder="Enter religion"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="block text-sm font-semibold mb-1">Gender</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-semibold mb-1">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-ful l border rounded-md p-2 focus:ring focus:ring-blue-300"
          >
            <option value="">Select role</option>
            <option value="Admin">Admin</option>
            <option value="Member">Member</option>
          </select>
        </div>

        {/* Image (read-only preview) */}
        {/* <div>
          <label className="block text-sm font-semibold mb-1">Image URL</label>
          <input
            type="text"
            name="image"
            value={form.image}
            readOnly
            className="w-full border rounded-md p-2 bg-gray-100"
          />
          <img
            src={form.image}
            alt="Preview"
            className="w-24 h-24 rounded-full mt-3 border object-cover"
          />
        </div>  */}

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("..")}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMember;
