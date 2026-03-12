const express = require("express");
const routes = express.Router();

const tasks = [
    {"id": 1, "title": "Clean kithen", "status": "completed"},
    {"id": 2, "title": "Make breakfast", "status": "incomplete"}
];

routes.get("/tasks", (req, res) =>{
    res.json(tasks);
});

routes.post("/tasks", (req, res) =>{
    const task = req.body;
    if(!task){
        return res.send("task is empty!");
    }else if(!task.id){
        task.id = tasks.length + 1;
    }
    tasks.push(task);
    res.send("task added successfully");
});

routes.put("/tasks/:id", (req, res) =>{
    let updateIndex = -1;
    const newTask = tasks.find((task, index) => {
        if(task.id == req.params.id){
            updateIndex = index;
            return task;
        }
    });
    if(!newTask){
        return res.status(400).send("task not found");    
    }
    const updatedTask = req.body;
    if(!updatedTask){
        return res.status(401).send("plz add task");
    }else if(!updatedTask.id){
        updatedTask.id = newTask.id;
    }
    tasks[updateIndex] = updatedTask;
    console.log(tasks); 
    res.send("task updated successfully");
});

routes.delete("/tasks/:id", (req, res) =>{
    const indexToDelete = tasks.find((task, index) =>{
        if(task.id == req.params.id){
            return index;
        }
    });
    if(indexToDelete !== -1){
        tasks.splice(indexToDelete, 1);
        res.send("Task deleted successfully");
    }else{
        res.status(401).send("Task not found");
    }
});

module.exports = routes;