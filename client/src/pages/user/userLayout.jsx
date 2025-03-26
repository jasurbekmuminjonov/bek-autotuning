import React from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import UserMenu from './userMenu';
import { FaCheck, FaCheckDouble, FaDoorOpen, FaHome, FaRegClock, FaUser } from 'react-icons/fa';
import Inprogress from './inprogress';
import Pending from './pending';
import Approve from './approve';
import Archived from './archived';
import { TbTool } from 'react-icons/tb';

const UserLayout = () => {
    const name = localStorage.getItem('name') || "User"
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <div className='user_layout'>
            <main>
                <Routes>
                    <Route path="/" element={<Inprogress />} />
                    <Route path="/pending" element={<Pending />} />
                    <Route path="/approve" element={<Approve />} />
                    <Route path="/archived" element={<Archived />} />
                </Routes>
            </main>
            <div className="navigate">
                <Link style={location.pathname === "/" ? { color: "#1677ff" } : {}} to="/">
                    <TbTool />
                </Link>
                <Link style={location.pathname === "/pending" ? { color: "#1677ff" } : {}} to="/pending">
                    <FaRegClock />
                </Link>
                <Link style={location.pathname === "/approve" ? { color: "#1677ff" } : {}} to="/approve">
                    <FaCheck />
                </Link>
                <Link style={location.pathname === "/archived" ? { color: "#1677ff" } : {}} to="/archived">
                    <FaCheckDouble />
                </Link>
                <Link onClick={() => {
                    localStorage.clear();
                    window.location.href = "/"
                }} style={location.pathname === "/user" ? { color: "#1677ff" } : {}} to="/user">
                    <FaDoorOpen />
                </Link>
            </div>
        </div>
    );
};


export default UserLayout;