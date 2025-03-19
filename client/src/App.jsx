import React from 'react';
import AdminLayout from './pages/admin/adminLayout';
import ManagerLayout from './pages/manager/managerLayout';
import UserLayout from './pages/user/userLayout';
import Login from './pages/login/login';
import { useSelector } from 'react-redux';

const App = () => {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('access_token');
  const loading = useSelector
  return (
    <div className='wrapper'>
      {token ? role === "admin" ? <AdminLayout /> : role === "manager" ? <ManagerLayout /> : role === "user" ? <UserLayout /> : <Login /> : <Login />}
    </div>
  );
};


export default App;