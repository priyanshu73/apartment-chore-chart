from typing import Union
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json

app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
class TaskUpdate(BaseModel):
    taskType: str
    name: str
    completed: bool
    date: str

tasks_data = {}

def load_tasks():
    global tasks_data
    with open('tasks.json', 'r') as file:
        tasks_data = json.load(file)

# Load tasks initially
load_tasks()

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/tasks")
def get_tasks():
    return tasks_data

@app.put("/update_task/")
async def update_task(task_update: TaskUpdate):
    taskType = task_update.taskType
    name = task_update.name
    completed = task_update.completed
    date = task_update.date

    if taskType not in tasks_data:
        raise HTTPException(status_code=404, detail="Task type not found")

    for entry in tasks_data[taskType]:
        if entry["name"] == name:
            entry["completed"] = completed
            entry["date"] = date
            with open('tasks.json', 'w') as f:
                json.dump(tasks_data, f, indent=2)
            return {"message": "Task updated successfully"}

    raise HTTPException(status_code=404, detail="Task not found")

@app.put("/reset/")
async def reset_table():
    if not tasks_data:  # Check if there are tasks to reset
        return {"message": "No tasks to reset."}

    for task_type in tasks_data:
        for entry in tasks_data[task_type]:
            entry["completed"] = False
            entry["date"] = ""

    with open('tasks.json', 'w') as f:
        json.dump(tasks_data, f, indent=2)

    return {"message": "Table Reset Successful"}
