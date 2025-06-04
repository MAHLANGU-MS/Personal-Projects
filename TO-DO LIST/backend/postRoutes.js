const express = require("express");
const { ObjectId } = require('mongodb');

let database = require("./connect");

const taskRoutes = express.Router();

//RETRIEVE 
taskRoutes.route("/tasks").get(async (req, res) => {
    let db = database.getDB();
    let tasks = db.collection("tasks");//if collection is not found, it will create a new one
    let result = await tasks.find({}).toArray();
    if(result.length > 0){
        res.json(result);
        console.log("Tasks retrieved successfully");
    }else{
        res.status(404).json({error: "No tasks found"});
        console.log("No tasks found");
    }
});

// Search tasks by department or other criteria
taskRoutes.route("/tasks/search").post(async (req, res) => {
    try {
        const db = database.getDB();
        const tasks = db.collection("tasks");
        
        // Build search query from request body
        const searchQuery = {};
        
        if (req.body.DEPARTMENT) {
            searchQuery.DEPARTMENT = req.body.DEPARTMENT;
        }
        
        if (req.body.NAME) {
            // Case-insensitive search for NAME containing the search term
            searchQuery.NAME = { $regex: req.body.NAME, $options: 'i' };
        }
        
        if (req.body.DATE_FROM && req.body.DATE_TO) {
            searchQuery.DATE = { 
                $gte: req.body.DATE_FROM,
                $lte: req.body.DATE_TO
            };
        } else if (req.body.DATE_FROM) {
            searchQuery.DATE = { $gte: req.body.DATE_FROM };
        } else if (req.body.DATE_TO) {
            searchQuery.DATE = { $lte: req.body.DATE_TO };
        }
        
        const result = await tasks.find(searchQuery).toArray();
        
        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).json({ error: "No tasks found matching the search criteria" });
        }
    } catch (err) {
        console.error("Error searching tasks:", err);
        res.status(500).json({ error: "Failed to search tasks" });
    }
});

// Get tasks by department
taskRoutes.route("/tasks/department/:department").get(async (req, res) => {
    try {
        const db = database.getDB();
        const tasks = db.collection("tasks");
        const department = req.params.department;
        
        const result = await tasks.find({ DEPARTMENT: department }).toArray();
        
        if (result.length > 0) {
            res.json(result);
        } else {
            res.status(404).json({ error: `No tasks found for department: ${department}` });
        }
    } catch (err) {
        console.error("Error fetching tasks by department:", err);
        res.status(500).json({ error: "Failed to fetch tasks by department" });
    }
});

// Get a single task by ID
taskRoutes.route("/tasks/:id").get(async (req, res) => {
    try {
        const db = database.getDB();
        const tasks = db.collection("tasks");
        const id = req.params.id;
        
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid task ID format" });
        }
        
        const task = await tasks.findOne({ _id: new ObjectId(id) });
        
        if (!task) {
            return res.status(404).json({ error: "Task not found" });
        }
        
        res.json(task);
    } catch (err) {
        console.error("Error fetching task:", err);
        res.status(500).json({ error: "Failed to fetch task" });
    }
});

//UPDATE
taskRoutes.route("/tasks/:id").put(async (req, res) => {
    try {
        const db = database.getDB();
        const tasks = db.collection("tasks");
        const id = req.params.id;
        
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid task ID format" });
        }
        
        // Check if task exists
        const existingTask = await tasks.findOne({ _id: new ObjectId(id) });
        
        if (!existingTask) {
            return res.status(404).json({ error: "Task not found" });
        }
        
        // Create update object
        const updateData = {};
        
        if (req.body.NAME !== undefined) updateData.NAME = req.body.NAME;
        if (req.body.DESCRIPTION !== undefined) updateData.DESCRIPTION = req.body.DESCRIPTION;
        if (req.body.DATE !== undefined) updateData.DATE = req.body.DATE;
        if (req.body.DEPARTMENT !== undefined) updateData.DEPARTMENT = req.body.DEPARTMENT;
        
        // Add updatedAt timestamp
        updateData.updatedAt = new Date();
        
        const result = await tasks.updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        
        res.json({
            success: true,
            message: "Task updated successfully",
            modifiedCount: result.modifiedCount
        });
    } catch (err) {
        console.error("Error updating task:", err);
        res.status(500).json({ error: "Failed to update task" });
    }
});

//DELETE
taskRoutes.route("/tasks/:id").delete(async (req, res) => {
    try {
        const db = database.getDB();
        const tasks = db.collection("tasks");
        const id = req.params.id;
        
        // Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return res.status(400).json({ error: "Invalid task ID format" });
        }
        
        const result = await tasks.deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Task not found or already deleted" });
        }
        
        res.json({
            success: true,
            message: "Task deleted successfully"
        });
    } catch (err) {
        console.error("Error deleting task:", err);
        res.status(500).json({ error: "Failed to delete task" });
    }
});

//CREATE
taskRoutes.route("/tasks").post(async (req, res) => {
    try {
        const db = database.getDB();
        const tasks = db.collection("tasks");
        
        // Validate request body
        const { NAME, DESCRIPTION, DATE, DEPARTMENT } = req.body;
        
        if (!NAME) {
            return res.status(400).json({ error: "Task NAME is required" });
        }
        
        // Create new task object
        const newTask = {
            NAME,
            DESCRIPTION: DESCRIPTION || "",
            DATE: DATE || new Date().toISOString(),
            DEPARTMENT: DEPARTMENT || "ADMIN",
            // createdAt: new Date()
        };
        
        const result = await tasks.insertOne(newTask);
        
        res.status(201).json({
            success: true,
            id: result.insertedId,
            task: newTask
        });
    } catch (err) {
        console.error("Error creating task:", err);
        res.status(500).json({ error: "Failed to create task" });
    }
});

module.exports = taskRoutes;

