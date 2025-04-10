import React from 'react';
import AdminHome from './adminHome';
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { FaChartArea, FaDoorOpen, FaUserClock } from 'react-icons/fa';
import { BiSolidCarMechanic } from 'react-icons/bi';
import Projects from './projects';
import Davomat from './davomat';
const AdminLayout = () => {
    const location = useLocation()
    return (
        <div className='admin_layout'>
            <Routes>
                <Route path="/" element={<AdminHome />} />
                <Route path="/project" element={<Projects />} />
                <Route path="/davomat" element={<Davomat />} />
            </Routes>
            <div className="navigator">
                <Link to="/" className={location.pathname === "/" ? "active_link" : null}>
                    <FaChartArea />
                </Link>
                <Link to="/project" className={location.pathname === "/project" ? "active_link" : null}>
                    <BiSolidCarMechanic />
                </Link>
                <Link to="/davomat" className={location.pathname === "/davomat" ? "active_link" : null}>
                    <FaUserClock />
                </Link>
                <Link onClick={() => {
                    localStorage.clear();
                    window.location.href = "/"
                }}>
                    <FaDoorOpen />
                </Link>
            </div>
        </div>
    );
};


export default AdminLayout;