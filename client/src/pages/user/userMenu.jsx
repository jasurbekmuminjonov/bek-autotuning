import React from 'react';
import { FaCheck, FaCheckDouble, FaRegClock } from 'react-icons/fa';
import { TbTool } from 'react-icons/tb';
import { Link, useLocation } from 'react-router-dom';

const UserMenu = () => {
    const location = useLocation()

    return (
        <div className='user_menu'>
            <h1>Bosh menyu</h1>
            <Link to="/inprogress">
                <TbTool size={"100px"} />
                Qilinayotgan servislar
            </Link>
            <Link to="/pending">
                <FaRegClock size={"100px"} />
                Boshlanmagan servislar
            </Link>
            <Link to="/approve">
                <FaCheck size={"100px"} />  Servisni tasdiqlash
            </Link>
            <Link to="/archived">
                <FaCheckDouble size={"100px"} />
                Tasdiqlangan servislar
            </Link>
        </div>
    );
};


export default UserMenu;