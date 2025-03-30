import React, { useEffect, useState } from 'react';
import { useFinishProjectMutation, useGetProjectsQuery, useStartProjectMutation } from '../../context/services/project.service';
import { useGetServiceQuery } from '../../context/services/service.service';
import moment from 'moment';
import { FaCheck, FaPlay } from 'react-icons/fa';
import { IoMdAlert } from 'react-icons/io';
import { message } from 'antd';
import emptyImg from '../../assets/empty.png';

const Pending = () => {
    const { data: projects = [] } = useGetProjectsQuery()
    const { data: services = [] } = useGetServiceQuery()
    const [startProject] = useStartProjectMutation()
    const [selectedServiceId, setSelectedServiceId] = useState("");
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [open, setOpen] = useState(false);
    const [userProjects, setUserProjects] = useState([])
    const userId = localStorage.getItem('user_id') || null
    if (!userId) {
        localStorage.clear()
        window.location.href = '/'
    }
    useEffect(() => {
        const filtered = projects.filter(project =>
            project.services_providing.some(service => service.user_id === userId && service.status === "pending" && service.index === 1)
        );
        setUserProjects(filtered)
    }, [projects, userId])

    const handleFinish = async () => {
        try {
            startProject({ project_id: selectedProjectId, service_id: selectedServiceId })
            setOpen(false)
            message.success("Servis boshlandi")
        } catch (err) {
            console.log(err)
            message.error("Xatolik yuz berdi")
        }
    }

        if (userProjects.length < 1) {
            return (
                <div className="user_page">
                    <div className="user_page_header">
                        <p>Boshlanmagan servislar</p>
                    </div>
                    <div className="user_projects">
                        <img src={emptyImg} alt="" />
                        <p>Servislar yo'q</p>
                    </div>
                </div>
            )
        }

    return (
        <div className='user_page'>
            {
                open && (
                    <div className="confirm">
                        <div className="confirm_title">
                            
                            <p>Chindan ham servisni tugatilganini tasdiqlaysizmi?</p>
                        </div>
                        <div className="confirm_body">
                            <p>Ushbu holatda servis 'qilinayotgan servislar' bo'limiga o'tadi va uni o'sha yerdan tugallanganini belgilashingiz mumkin</p>
                        </div>
                        <div className="confirm_footer">
                            <button onClick={() => setOpen(false)} style={{ background: "#1677ff", color: "#fff" }}>Orqaga</button>
                            <button onClick={handleFinish}>Tasdiqlash</button>
                        </div>
                    </div>
                )
            }
            <div className="user_page_header">
                <p>Boshlanmagan servislar</p>
            </div>
            <div className="user_projects">
                {
                    userProjects?.map((item) => (
                        <div key={item._id} className="user_project">
                            <div className="user_project_title">
                                <div className="title">
                                    <b>Mashina nomi:</b>
                                    <p>{item.car_name}</p>
                                </div>
                                <div className="title">
                                    <b>Mashina raqami:</b>
                                    <p>{item.car_number}</p>
                                </div>
                                <div className="title">
                                    <b>Klent ismi:</b>
                                    <p>{item.client_name}</p>
                                </div>
                                <div className="title">
                                    <b>Klent raqami:</b>
                                    <p>{item.client_phone}</p>
                                </div>
                            </div>
                            <div className="project_services">
                                <b>Boshlash uchun servislar</b>
                                {
                                    item.services_providing.filter(service => service.user_id === userId && service.status === "pending" && service.index === 1).map((service) => (
                                        <div key={service._id} className="service_card">
                                            <p>Servis: {services.find(s => s._id === service.service_id).service_name}</p>
                                            <p>Muddat: {moment(service.end_time).format("DD.MM.YYYY")}</p>
                                            <div className="service_actions">
                                                <button onClick={() => { setOpen(true); setSelectedProjectId(item._id); setSelectedServiceId(service._id) }}>
                                                    <FaPlay />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div >
    );
};


export default Pending;