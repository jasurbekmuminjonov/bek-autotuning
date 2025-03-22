import React from 'react';
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import UserMenu from './userMenu';
import { FaHome } from 'react-icons/fa';
import Inprogress from './inprogress';
import Pending from './pending';
import Approve from './approve';
import Archived from './archived';

const UserLayout = () => {
    const name = localStorage.getItem('name') || "User"
    const location = useLocation()
    const navigate = useNavigate()

    return (
        <div className='user_layout'>
            <header>
                {
                    location.pathname !== "/" && <button onClick={() => navigate("/")}><FaHome /> Bosh menyu</button>
                }
                <p onClick={() => window.location.href = "/"}>{name}</p>
                <button onClick={() => {
                    localStorage.clear();
                    window.location.reload();
                }}>
                    Chiqish
                </button>
            </header>
            <main>
                <Routes>
                    <Route path="/" element={<UserMenu />} />
                    <Route path="/inprogress" element={<Inprogress />} />
                    <Route path="/pending" element={<Pending />} />
                    <Route path="/approve" element={<Approve />} />
                    <Route path="/archived" element={<Archived />} />
                </Routes>
            </main>
            {/* <aside>
                <Link style={location.pathname === "/" ? { border: "1px solid #000" } : {}} to="/">
                    Bajarilmoqda
                </Link>
                <Link style={location.pathname === "/pending" ? { border: "1px solid #000" } : {}} to="/pending">
                    Kutilmoqda
                </Link>
                <Link style={location.pathname === "/approve" ? { border: "1px solid #000" } : {}} to="/approve">
                    Tasdiqlash
                </Link>
                <Link style={location.pathname === "/archived" ? { border: "1px solid #000" } : {}} to="/archived">
                    Arxivlangan
                </Link>
            </aside>
            <main>
                <header>
                    <p>{name}</p>
                    <button>
                        Chiqish
                    </button>
                </header>
                <div className="main">

                </div>
            </main> */}
        </div>
    );
};


export default UserLayout;