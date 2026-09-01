from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from uuid import uuid4


class Task(BaseModel):
    id: str
    task: str
    completed: bool = False


class TaskCreate(BaseModel):
    task: str


app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://10.103.3.25:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

tasks: list[Task] = []


@app.get("/tasks")
def get_tasks():
    return tasks

@app.post("/tasks")
def create_task(task: TaskCreate):
    tasks.append(Task(id=str(uuid4()), task=task.task, completed=False))
    return tasks

@app.delete("/tasks/{id}")
def delete_task(id: str):
    matches = [i for i, t in enumerate(tasks) if t.id == id]
    if len(matches) == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    idx = matches[0]
    del tasks[idx]
    return tasks


@app.put("/tasks/{id}")
def update_task(task: Task):
    matches = [i for i, t in enumerate(tasks) if t.id == task.id]
    if len(matches) == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    idx = matches[0]
    tasks[idx] = Task(id=task.id, task=task.task, completed=task.completed)
    return tasks
