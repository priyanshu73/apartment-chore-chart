import React, { useState } from 'react';
import '../style.css';
import { googleLogout } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const TaskTable = () => {
  const navigate = useNavigate();
  
  const members = ["Andry", "Hayden", "Nafis", "Priyanshu", "Sanij", "Soikat", "Ulugbek", "Ward"];

  // Define members responsible for each task
  const kitchenTrashMembers = ["Nafis", "Priyanshu", "Sanij", "Soikat"];
  const toiletA = ["Andry", "Priyanshu", "Soikat", "Ulugbek"];
  const toiletB = ["Hayden", "Nafis", "Sanij", "Ward"];
  
  const user = JSON.parse(localStorage.getItem('user'));

  // Initial state for task completion (true = done, false = not done)
  const [mainDoorTrash, setMainDoorTrash] = useState(
    members.map(() => ({ completed: false, date: "" }))
  );
  const [kitchenTrash, setKitchenTrash] = useState(
    kitchenTrashMembers.map(() => ({ completed: false, date: "" }))
  );
  const [toiletAStatus, setToiletAStatus] = useState(
    toiletA.map(() => ({ completed: false, date: "" }))
  );
  const [toiletBStatus, setToiletBStatus] = useState(
    toiletB.map(() => ({ completed: false, date: "" }))
  );

  // Handle task completion toggle
  const handleToggleTask = (task, setTask, index) => {
    const updatedTask = [...task];
    const currentDate = new Date().toLocaleDateString(); 

    updatedTask[index].completed = !updatedTask[index].completed;  
    updatedTask[index].date = updatedTask[index].completed ? currentDate : "";  
    setTask(updatedTask);
  };

  const calculateCompletionPercentage = (task) => {
    const totalTasks = task.length;
    const completedTasks = task.filter(t => t.completed).length;
    return totalTasks ? (completedTasks / totalTasks) * 100 : 0;
  };

  const isCurrentUser = (memberName) => {
    if (!user || !user.name) return false;
    return user.name.toLowerCase().includes(memberName.toLowerCase());
  };

  const handleLogout = () => {
    googleLogout();
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="task-tables">
      <h1>Welcome, {user.name}!</h1>
      <p>Email: {user.email}</p>
      <button onClick={handleLogout}>Logout</button>

      <h2>Main Door Trash</h2>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${calculateCompletionPercentage(mainDoorTrash)}%` }}></div>
      </div>
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
              <td>{member} {mainDoorTrash[index].completed && <span role="img" aria-label="happy">😊</span>}</td>
              <td>
                <input
                  type="checkbox"
                  checked={mainDoorTrash[index].completed}
                  onChange={() =>
                    handleToggleTask(mainDoorTrash, setMainDoorTrash, index)
                  }
                  disabled={!isCurrentUser(member)}
                />
              </td>
              <td>{mainDoorTrash[index].date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Kitchen Trash</h2>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${calculateCompletionPercentage(kitchenTrash)}%` }}></div>
      </div>
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
                  disabled={!isCurrentUser(member)}
                />
              </td>
              <td>{kitchenTrash[index].date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Toilet A Table */}
      <h2>Toilet A</h2>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${calculateCompletionPercentage(toiletAStatus)}%` }}></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Resident</th>
            <th>Completed</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {toiletA.map((member, index) => (
            <tr key={member}>
              <td>{member}</td>
              <td>
                <input
                  type="checkbox"
                  checked={toiletAStatus[index].completed}
                  onChange={() =>
                    handleToggleTask(toiletAStatus, setToiletAStatus, index)
                  }
                  disabled={!isCurrentUser(member)}
                />
              </td>
              <td>{toiletAStatus[index].date}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Toilet B Table */}
      <h2>Toilet B</h2>
      <div className="progress-container">
        <div className="progress-bar" style={{ width: `${calculateCompletionPercentage(toiletBStatus)}%` }}></div>
      </div>
      <table>
        <thead>
          <tr>
            <th>Resident</th>
            <th>Completed</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {toiletB.map((member, index) => (
            <tr key={member}>
              <td>{member}</td>
              <td>
                <input
                  type="checkbox"
                  checked={toiletBStatus[index].completed}
                  onChange={() =>
                    handleToggleTask(toiletBStatus, setToiletBStatus, index)
                  }
                  disabled={!isCurrentUser(member)}
                />
              </td>
              <td>{toiletBStatus[index].date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
