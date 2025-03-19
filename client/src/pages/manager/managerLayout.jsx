import React, { useState } from 'react';
import { BiSolidCarMechanic } from 'react-icons/bi';
import { FaChevronLeft, FaChevronRight, FaDollarSign, FaDoorOpen, FaTools, FaUser } from 'react-icons/fa';
import { FaSackDollar } from 'react-icons/fa6';
import { Link, Route, Routes, useLocation } from 'react-router-dom';
import Users from './users';
import Services from './services';
import Projects from './projects';
import { IoMdAddCircle } from 'react-icons/io';
import AddProject from './addProject';
import Spendings from './spendings';

const ManagerLayout = () => {
    const location = useLocation()
    const name = localStorage.getItem('name') || ''
    const [collapsed, setCollapsed] = useState(false)
    return (
        <div className='manager_layout'>
            <aside style={collapsed ? { display: "none" } : { display: "flex" }}>
                <p onClick={() => window.location.href = "/"}>BEK AUTOTUNING</p>
                <div className="links">
                    <Link className={`aside_link ${location.pathname === "/" && "active"}`} to="/">
                        <BiSolidCarMechanic />

                        Mashinalar</Link>
                    <Link className={`aside_link ${location.pathname === "/addproject" && "active"}`} to="/addproject">
                        <IoMdAddCircle />



                        Mashina qo'shish</Link>
                    <Link className={`aside_link ${location.pathname === "/user" && "active"}`} to="/user">
                        <FaUser />

                        Ishchilar</Link>
                    <Link className={`aside_link ${location.pathname === "/service" && "active"}`} to="/service">
                        <FaTools />

                        Servislar</Link>
                    <Link className={`aside_link ${location.pathname === "/salary" && "active"}`} to="/salary">
                        <FaDollarSign />
                        Oylik maosh</Link>
                    <Link className={`aside_link ${location.pathname === "/expense" && "active"}`} to="/expense">
                        <FaSackDollar />
                        Xarajatlar</Link>
                </div>
            </aside>
            <main>
                <header>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <button style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", border: "1px solid #ccc" }} onClick={() => setCollapsed(!collapsed)}>
                            {!collapsed ? <FaChevronLeft /> : <FaChevronRight />}
                        </button>
                        <p>{name}</p>
                    </div>
                    <button onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                    }}>
                        <FaDoorOpen /> Chiqish
                    </button>
                </header>
                <Routes>
                    <Route path='/' element={<Projects />} />
                    <Route path='/user' element={<Users />} />
                    <Route path='/service' element={<Services />} />
                    <Route path='/addproject' element={<AddProject />} />
                    <Route path='/expense' element={<Spendings />} />
                    <Route path='/addproject/:id' element={<AddProject />} />
                </Routes>
            </main>
        </div>
    );
};


export default ManagerLayout;