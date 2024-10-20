import React, { useState } from 'react';
import '../style.css';

const TaskTable = () => {
  const members = ["Andry", "Hayden", "Nafis", "Priyanshu", "Sanij", "Soikat", "Ulugbek", "Ward"];

  // Define members responsible for each task
  const kitchenTrashMembers = [ "Nafis", "Priyanshu", "Sanij", "Soikat"];
  const user = JSON.parse(localStorage.getItem('user'));


  // Initial state for task completion (true = done, false = not done)
  const [mainDoorTrash, setMainDoorTrash] = useState(
    members.map(() => ({ completed: false, date: "" }))
  );
  const [kitchenTrash, setKitchenTrash] = useState(
    kitchenTrashMembers.map(() => ({ completed: false, date: "" }))
  );

  // Handle task completion toggle
  const handleToggleTask = (task, setTask, index) => {
    const updatedTask = [...task];
    const currentDate = new Date().toLocaleDateString(); 

    updatedTask[index].completed = !updatedTask[index].completed;  
    updatedTask[index].date = updatedTask[index].date ? currentDate : "";  
    setTask(updatedTask);
  };

  return (
    <div className="task-tables">
      <h2>Main Door Trash</h2>
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <button>Logout</button>
      <table>
        <thead>
          <tr>
            <th>Resident</th>
            <th>Completed</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => (
            <tr key={member}>
              <td>{member}  {mainDoorTrash[index].completed && (
          <span role="img" aria-label="happy">😊</span>
        )}</td>
              <td>
                <input
                  type="checkbox"
                  checked={mainDoorTrash[index].completed}
                  onChange={() =>
                    handleToggleTask(mainDoorTrash, setMainDoorTrash, index)
                  }
                />
              </td>
              <td>{mainDoorTrash[index].date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Kitchen Trash</h2>
      <table>
        <thead>
          <tr>
            <th>Resident</th>
            <th>Completed</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {kitchenTrashMembers.map((member, index) => (
            <tr key={member}>
              <td>{member}</td>
              <td>
                <input
                  type="checkbox"
                  checked={kitchenTrash[index].completed}
                  onChange={() =>
                    handleToggleTask(kitchenTrash, setKitchenTrash, index)
                  }
                />
              </td>
              <td>{kitchenTrash[index].date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
