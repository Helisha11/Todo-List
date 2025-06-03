"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/tasks";

const Page = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState(""); // Optional: not used in Flask yet
  const [tasks, setTasks] = useState([]);
  const [editIndex, setEditIndex] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");

  // 🔁 Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get(API_URL);
    setTasks(res.data);
  };

  // ➕ Add new task
  const submitHandler = async (e) => {
    e.preventDefault();
    if (!title.trim()) return; // Prevent empty title
    const newTask = { title, description };
    try {
      await axios.post(API_URL, newTask);
      fetchTasks();
      setTitle("");
      setDescription("");
    } catch (err) {
      alert("Failed to add task. Please check your backend server.");
    }
  };

  // ❌ Delete task
  const deleteHandler = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchTasks();
    } catch (err) {
      alert("Failed to delete task. Please check your backend server.");
    }
  };

  // ✅ Update task
  const updateTask = async (taskId, updatedData) => {
    try {
      await axios.put(`${API_URL}/${taskId}`, updatedData);
      fetchTasks();
      setEditIndex(null);
    } catch (err) {
      alert("Failed to update task. Please check your backend server.");
    }
  };

  let renderTasks = <h2 className="text-2xl">No Task Available</h2>;

  if (tasks.length > 0) {
    renderTasks = tasks.map((task, i) => {
      if (editIndex === i) {
        return (
          <li
            className="flex justify-between items-center bg-white p-5 m-2 rounded-lg shadow-lg"
            key={task.id}
          >
            <div className="w-2/3 mb-5">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="border-2 border-gray-300 p-3 mb-2 w-96 text-lg"
              />
              <input
                type="text"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="border-2 border-gray-300 p-3 w-96 text-lg"
              />
            </div>
            <button
              onClick={() =>
                updateTask(task.id, { title: editTitle, description: editDescription, completed: task.completed })
              }
              className="bg-green-500 text-white font-bold px-4 py-2 rounded-lg mr-2"
            >
              Save
            </button>
            <button
              onClick={() => setEditIndex(null)}
              className="bg-gray-400 text-white font-bold px-4 py-2 rounded-lg"
            >
              Cancel
            </button>
          </li>
        );
      }

      return (
        <li
          className="flex justify-between items-center bg-white p-5 m-2 rounded-lg shadow-lg"
          key={task.id}
        >
          <div className="w-2/3 mb-5">
            <h5 className="font-semibold text-3xl">{task.title}</h5>
            <p className="font-semibold text-xl text-gray-700">{task.description}</p>
          </div>
          <div>
            <button
              onClick={() => {
                setEditIndex(i);
                setEditTitle(task.title);
                setEditDescription(task.description);
              }}
              className="bg-yellow-400 text-white font-bold px-4 py-2 rounded-lg mr-2"
            >
              Edit
            </button>
            <button
              onClick={() => deleteHandler(task.id)}
              className="bg-red-400 text-white font-bold px-4 py-2 rounded-lg"
            >
              Delete
            </button>
          </div>
        </li>
      );
    });
  }

  return (
    <>
      <h1 className="bg-blue-700 text-white font-bold text-5xl text-center p-5">
        Todo-List
      </h1>
      <form onSubmit={submitHandler}>
        <input
          type="text"
          placeholder="Add a new task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border-3 border-gray-300 p-4 m-5 w-96 text-lg"
        />
        <input
          type="text"
          placeholder="Add Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border-3 border-gray-300 p-4 m-5 w-96 text-lg"
        />
        <input
          type="submit"
          value="Add Task"
          className="bg-blue-700 text-white font-bold py-2 px-4 mt-5"
        />
      </form>
      <hr className="border-none" />
      <div className="p-8 bg-slate-200 border-0 h-1/4">
        <ul>{renderTasks}</ul>
      </div>
    </>
  );
};

export default Page;
