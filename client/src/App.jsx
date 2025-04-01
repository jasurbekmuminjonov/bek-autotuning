import React, { useEffect } from 'react';
import AdminLayout from './pages/admin/adminLayout';
import ManagerLayout from './pages/manager/managerLayout';
import UserLayout from './pages/user/userLayout';
import Login from './pages/login/login';
import { useSelector } from 'react-redux';
import Loading from './components/loading/loading';

const App = () => {
  const role = localStorage.getItem('role');
  const token = localStorage.getItem('access_token');
  const loading = useSelector(state => state.loading)
  useEffect(() => {
    document.title = localStorage.getItem('admin_name');
  }, []);
  return (
    <div className='wrapper'>
      {loading && <Loading />}
      {token ? role === "admin" ? <AdminLayout /> : role === "manager" ? <ManagerLayout /> : role === "user" ? <UserLayout /> : <Login /> : <Login />}
    </div>
  );
};


export default App;