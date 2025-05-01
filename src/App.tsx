import { useEffect, useState } from "react";
import "./App.css";
import { supabase } from "./supabase-client";

interface Task {
  id: number,
  title: string,
  description: string,
  created_at: string
}

function App() {
  const [newTask, setNewTask] = useState({ title: "", description: "" });
  const [isEditting, setIsEditting] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newDescription, setNewDescription] = useState<string>("");

  const fetchTasks = async () => {
    const { error, data } = await supabase
      .from("tasks")
      .select("*")
      .order("created_at", { ascending: true })

    console.log(data);

    if (error) {
      console.error("Error adding task", error?.message);
    }

    setTasks(data || []);
  }

  useEffect(() => {
    fetchTasks()
  }, []);

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const { error } = await supabase
      .from("tasks")
      .insert(newTask)
      .single();

    if (error) {
      console.error("Error adding task", error?.message);
      return;
    }

    setNewTask({ title: "", description: "" });
    fetchTasks();
  }

  const deleteTask = async (id: number) => {
    const { data, error } = await supabase.from("tasks").delete().eq("id", id);
    if (error) {
      console.error("Error adding task", error?.message);
      return;
    }
    console.log("data", data);
    fetchTasks();
  }

  const updateTask = async (id: number) => {
    const { error, data } = await supabase
      .from("tasks")
      .update({ description: newDescription })
      .eq("id", id);

    if (error) {
      console.error("Error adding task", error?.message);
    }
    console.log("data", data);
    setIsEditting(false);
    fetchTasks();
  }

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "1rem" }}>
      <h2>Task Manager CRUD</h2>

      {/* Form to add a new task */}
      <form onSubmit={handleSubmit} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Task Title"
          onChange={(e) => setNewTask((prev) => ({ ...prev, description: e.target.value }))}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <textarea
          placeholder="Task Description"
          onChange={(e) => { setNewTask((prev) => ({ ...prev, title: e.target.value })) }}
          style={{ width: "100%", marginBottom: "0.5rem", padding: "0.5rem" }}
        />
        <button type="submit" style={{ padding: "0.5rem 1rem" }}>
          Add Task
        </button>
      </form>

      {/* List of Tasks */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks && tasks.map((task, key) => (
          < li
            key={key}
            style={{
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "1rem",
              marginBottom: "0.5rem",
            }}
          >
            <div>
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <div>
                {isEditting && <textarea
                  placeholder="Updated description..."
                  onChange={(e) => setNewDescription(e.target.value)}
                />}
                {isEditting ?
                  <button
                    onClick={() => {
                      updateTask(task.id)
                    }}
                    style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}>
                    save
                  </button>
                  :
                  <button
                    onClick={() => {
                      setIsEditting(true)
                    }}
                    style={{ padding: "0.5rem 1rem", marginRight: "0.5rem" }}>
                    Edit
                  </button>}
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{ padding: "0.5rem 1rem" }}>
                  Delete
                </button>
              </div>
            </div>
          </li>
        ))}

      </ul>
    </div >
  );
}

export default App;