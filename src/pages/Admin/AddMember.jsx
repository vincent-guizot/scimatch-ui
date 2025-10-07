import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddMember = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "123", // default password
    fullname: "",
    address: "",
    age: "",
    religion: "",
    gender: "",
    role: "",
    image: "https://placehold.co/300/png", // default image
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.username || !form.fullname || !form.password) {
      Swal.fire(
        "Missing fields",
        "Username, Fullname, and Password are required.",
        "warning"
      );
      return;
    }

    try {
      const res = await fetch("https://sci-server.onrender.com/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create member");

      Swal.fire("Success!", "Member added successfully!", "success");
      navigate(".."); // navigate back to /members (relative path)
    } catch (error) {
      Swal.fire("Error", "Failed to add member. Please try again.", "error");
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg p-8">
      <h1 className="text-2xl font-bold mb-6">Add New Member</h1>

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
          <label className="block text-sm font-semibold mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
            placeholder="Enter password"
            required
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
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Role */}
        <div>
          <label className="block text-sm font-semibold mb-1">Role</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded-md p-2 focus:ring focus:ring-blue-300"
          >
            <option value="">Select role</option>
            <option value="admin">Admin</option>
            <option value="member">Member</option>
          </select>
        </div>

        {/* Image (read-only default) */}
        <div>
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
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate("..")} // back to /members
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
          >
            Add Member
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMember;
