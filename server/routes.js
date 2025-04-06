const express = require('express');
const { createAdmin, createManager, createUser } = require('./controllers/adminController');
const auth = require('./middlewares/auth');
const { login } = require('./controllers/authController');
const { createService, getService, updateService, deleteService } = require('./controllers/serviceController');
const { getProject, createProject, updateProject, deleteProject, finishProject, getProjectByUser, getAllProjectByUser, createPayment, pauseToggle } = require('./controllers/projectController');
const { getUsers, getUser, getProjectsByUser, getProjectsForApprove, getProjectsForFinish, approveService, finishService, rejectService, getBalance, editUser, getProjectsForStart, startProject, getApprovedProjects, payUser, updateSalary, deleteSalary, setWeekend, removeWeekend, pauseUser, resumeUser } = require('./controllers/userController');
const { createExpense, getExpense, updateExpense, deleteExpense } = require('./controllers/expenseController');
const { recordAttendance } = require('./controllers/attendanceController');
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
rt.get("/project/approved/:user_id", auth, getApprovedProjects) //get projects by user id approved
rt.get("/project/finish", auth, getProjectsForFinish) //get projects by user id for finish
rt.get("/project/start", auth, getProjectsForStart)
rt.put("/project/start/:project_id/:service_id", auth, startProject)
rt.post("/project/create", auth, createProject) //create project
rt.put("/project/update/:id", auth, updateProject) //update project
rt.delete("/project/delete/:id", auth, deleteProject) //delete project
rt.put("/project/finish/:project_id", auth, finishProject) //finish project
rt.put("/project/service/finish/:project_id/:service_id", auth, finishService) //finish service
rt.put("/project/service/pause/:project_id/:service_id", auth, pauseToggle) //pause service
rt.put("/project/service/approve/", auth, approveService) //approve service
rt.put("/project/service/reject/", auth, rejectService) //approve service
rt.put("/project/pay/:project_id", auth, createPayment) //create payment

rt.get('/user/get/', auth, getUser) //get user by id
rt.get('/user/get/', auth, getUser) //get user balance
rt.get('/user/get/all', auth, getUsers) //get all users
rt.get("/user/projects/:user_id", auth, getProjectByUser) //get project by user
rt.get("/user/all/projects/:user_id", auth, getAllProjectByUser) //get all project by user
rt.post("/user/pay/:user_id", auth, payUser) //pay user
rt.put("/user/salary", auth, updateSalary)
rt.delete("/user/salary", auth, deleteSalary)
rt.put("/user/weekend/:user_id", auth, setWeekend) //update user
rt.delete("/user/weekend/:user_id", auth, removeWeekend) //update user
rt.get('/user/:user_id/', auth, getBalance)
rt.put("/user/:user_id/", auth, editUser) //update user
rt.put("/user/:user_id/pause", auth, pauseUser) //pause user
rt.put("/user/:user_id/:pause_id/resume", auth, resumeUser) //resume user

rt.post('/expense/create', auth, createExpense) //create expense
rt.get('/expense/get', auth, getExpense) //create expense
rt.put('/expense/update/:id', auth, updateExpense) //update expense
rt.delete('/expense/delete/:id', auth, deleteExpense) //delete expense

rt.post("/attendance/create", recordAttendance)

module.exports = rt;