import React, { useState, useEffect } from 'react';
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

  const setters = [setMainDoorTrash, setKitchenTrash, setToiletAStatus, setToiletBStatus];
  const loadTable = (index, tasks) => {
    setters[index](tasks);
  };




  // Commented out useEffect
  const [shouldRefetch, setShouldRefetch] = useState(false);
  useEffect(() => {
    const fetchTasks = async () => {
        try {
            const response = await fetch('http://127.0.0.1:8000/tasks');
            const data = await response.json();
            // Assuming your JSON data is stored in a variable called 'data'
            Object.values(data).forEach((table, index) => {
              loadTable(index,table);
            });

        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    fetchTasks();
  }, [shouldRefetch]); // Empty dependency array means it runs once on mount
  

  const createRequestBody = (type, name, completed, date) => {
    const body = {
        taskType: type,
        name: name,
        completed: completed,
        date: date
    };

    return body;
};


const handleReset = async () => {
  try {
      const response = await fetch('http://127.0.0.1:8000/reset/', {
          method: 'PUT'
      });

      // Check if the response is successful
      if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Optionally handle the response data
      const data = await response.json(); // Assuming the server returns JSON
      console.log('Reset successful:', data);

      setShouldRefetch(prev => !prev);
  } catch (error) {
      console.error('Error resetting table:', error);
      // Optionally provide user feedback about the error
  }
};

  const handleTaskUpdate = async (taskData) => {
    try {
        const response = await fetch('http://127.0.0.1:8000/update_task/', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json', // Specify the content type
            },
            body: JSON.stringify(taskData), // Convert your object to JSON string
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json(); // Optional: handle response data if needed
        console.log('Task updated successfully:', data);
        setShouldRefetch(prev => !prev); // Toggle to trigger refetch
    } catch (error) {
        console.error('Error updating task:', error);
    }
};

  // Handle task completion toggle for frontend only app//
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
    console.log(`Total: ${totalTasks}, Completed: ${completedTasks}`); // Debugging
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
                  onChange={() => {
                    // Check if the member is allowed to send the request
                    if (isCurrentUser(member)) { // Assuming 'member' is truthy if valid
                        // Calculate the new completed state
                        const newCompletedState = !mainDoorTrash[index].completed;
                
                        // Update the task completion state
                        handleToggleTask(mainDoorTrash, setMainDoorTrash, index);
                
                        // Create request body with the necessary information
                        const requestBody = createRequestBody(
                            "mainDoorTrash", // Assuming you have a taskType
                            member, // The name of the member who checked the task
                            newCompletedState, // Send the new completed state
                            new Date().toLocaleDateString() // Current date
                        );
                
                        // Log the request body for debugging
                        console.log(requestBody);
                
                        // Call the function to handle the task update, passing the request body
                        handleTaskUpdate(requestBody);
                    } else {
                        console.log("Unauthorized: Only members can send requests.");
                        // Optionally, you can also provide user feedback here
                    }
                }}
                
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
              <td>{member} {kitchenTrash[index].completed && <span role="img" aria-label="happy">😊</span>}</td>
              <td>
                <input
                  type="checkbox"
                  checked={kitchenTrash[index].completed}
                  onChange={() => {
                    // Check if the member is allowed to send the request
                    if (isCurrentUser(member)) { // Assuming 'member' is truthy if valid
                        // Calculate the new completed state
                        const newCompletedState = !kitchenTrash[index].completed;
                
                        // Update the task completion state
                        handleToggleTask(kitchenTrash, setKitchenTrash, index);
                
                        // Create request body with the necessary information
                        const requestBody = createRequestBody(
                            "kitchenTrash", // Assuming you have a taskType
                            member, // The name of the member who checked the task
                            newCompletedState, // Send the new completed state
                            new Date().toLocaleDateString() // Current date
                        );
                
                        // Log the request body for debugging
                        console.log(requestBody);
                
                        // Call the function to handle the task update, passing the request body
                        handleTaskUpdate(requestBody);
                    } else {
                        console.log("Unauthorized: Only members can send requests.");
                        // Optionally, you can also provide user feedback here
                    }
                }}
                
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
              <td>{member} {toiletAStatus[index].completed && <span role="img" aria-label="happy">😊</span>} </td>
              <td>
                <input
                  type="checkbox"
                  checked={toiletAStatus[index].completed}
                  onChange={() => {
                    // Check if the member is allowed to send the request
                    if (isCurrentUser(member)) { // Assuming 'member' is truthy if valid
                        // Calculate the new completed state
                        const newCompletedState = !toiletAStatus[index].completed;
                
                        // Update the task completion state
                        handleToggleTask(toiletAStatus, setToiletAStatus, index);
                
                        // Create request body with the necessary information
                        const requestBody = createRequestBody(
                            "toiletA", // Assuming you have a taskType
                            member, // The name of the member who checked the task
                            newCompletedState, // Send the new completed state
                            new Date().toLocaleDateString() // Current date
                        );
                
                        // Log the request body for debugging
                        console.log(requestBody);
                
                        // Call the function to handle the task update, passing the request body
                        handleTaskUpdate(requestBody);
                    } else {
                        console.log("Unauthorized: Only members can send requests.");
                        // Optionally, you can also provide user feedback here
                    }
                }}
                
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
              <td>{member}  {toiletBStatus[index].completed && <span role="img" aria-label="happy">😊</span>}</td>
              <td>
                <input
                  type="checkbox"
                  checked={toiletBStatus[index].completed}
                  onChange={() => {
                    // Check if the member is allowed to send the request
                    if (isCurrentUser(member)) { // Assuming 'member' is truthy if valid
                        // Calculate the new completed state
                        const newCompletedState = !toiletBStatus[index].completed;
                
                        // Update the task completion state
                        handleToggleTask(toiletBStatus, setToiletBStatus, index);
                
                        // Create request body with the necessary information
                        const requestBody = createRequestBody(
                            "toiletB", // Assuming you have a taskType
                            member, // The name of the member who checked the task
                            newCompletedState, // Send the new completed state
                            new Date().toLocaleDateString() // Current date
                        );
                
                        // Log the request body for debugging
                        console.log(requestBody);
                
                        // Call the function to handle the task update, passing the request body
                        handleTaskUpdate(requestBody);
                    } else {
                        console.log("Unauthorized: Only members can send requests.");
                        // Optionally, you can also provide user feedback here
                    }
                }}
                
                  disabled={!isCurrentUser(member)}
                />
              </td>
              <td>{toiletBStatus[index].date}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button className ="reset" onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default TaskTable;
