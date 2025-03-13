const express = require('express');
const { createAdmin, createManager, createUser } = require('./controllers/adminController');
const auth = require('./middlewares/auth');
const { login } = require('./controllers/authController');
const { createService, getService, updateService, deleteService } = require('./controllers/serviceController');
const { getProject, createProject, updateProject, deleteProject } = require('./controllers/projectController');
const { getUsers, getUser, getProjectsByUser, getProjectsForApprove, finishProject, approveProject, rejectProject } = require('./controllers/userController');
const { createExpense, getExpense, updateExpense, deleteExpense } = require('./controllers/expenseController');
const rt = express.Router();

rt.post('/register/admin', createAdmin) //create admin
rt.post('/register/manager', auth, createManager) //create manager
rt.post('/register/user', auth, createUser) //create user

rt.post("/login", login) //auth

rt.get('/service/get', auth, getService) //get service
rt.post('/service/create', auth, createService) //create service
rt.put('/service/update/:id', auth, updateService) //update service
rt.delete('/service/delete/:id', auth, deleteService) //delete service

rt.get("/project/get", auth, getProject) //get project
rt.get("/project/user", auth, getProjectsByUser) //get projects by user id
rt.get("/project/approve", auth, getProjectsForApprove) //get projects by user id for approval
// rt.get("/project/start", auth, getProjectsForStart)
// rt.put("/project/start/:project_id", auth, startProject) 
rt.post("/project/create", auth, createProject) //create project
rt.put("/project/update", auth, updateProject) //update project
rt.delete("/project/delete", auth, deleteProject) //delete project
rt.put("/project/finish/:project_id", auth, finishProject) //finish project
rt.put("/project/approve/:project_id", auth, approveProject) //approve project
rt.put("/project/reject/:project_id", auth, rejectProject) //approve project

rt.get('/user/get/all', auth, getUsers) //get all users
rt.get('/user/get/', auth, getUser) //get user by id

rt.post('/expense/create', auth, createExpense) //create expense
rt.get('/expense/get', auth, getExpense) //create expense
rt.put('/expense/update/:id', auth, updateExpense) //update expense
rt.delete('/expense/delete/:id', auth, deleteExpense) //delete expense

module.exports = rt;