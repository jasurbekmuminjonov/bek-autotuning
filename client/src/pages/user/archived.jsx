import React, { useEffect, useState } from 'react';
import { useFinishProjectMutation, useGetProjectsQuery } from '../../context/services/project.service';
import { useGetServiceQuery } from '../../context/services/service.service';
import moment from 'moment';
import { FaCheck } from 'react-icons/fa';
import { IoMdAlert } from 'react-icons/io';
import { message } from 'antd';

const Archived = () => {
    const { data: projects = [] } = useGetProjectsQuery()
    const { data: services = [] } = useGetServiceQuery()
    const [finishProject] = useFinishProjectMutation()
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
            project.services_providing.some(service => service.user_id === userId && service.status === "approved")
        );
        setUserProjects(filtered)
    }, [projects, userId])

    const handleFinish = async () => {
        try {
            finishProject({ project_id: selectedProjectId, service_id: selectedServiceId })
            setOpen(false)
            message.success("Servis tugatildi")
        } catch (err) {
            console.log(err)
            message.error("Xatolik yuz berdi")
        }
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
                            <p>Ushbu holatda ushbu servis sizdan keyingi servis ishchisining tasdiqlash bo'limiga qo'shiladi. Keyin tasdiqlangach avtomatik ravishda maosh sizning hisobingizga yoziladi va menejerga ko'rinadi</p>
                        </div>
                        <div className="confirm_footer">
                            <button onClick={() => setOpen(false)} style={{ background: "#1677ff", color: "#fff" }}>Orqaga</button>
                            <button onClick={handleFinish}>Tasdiqlash</button>
                        </div>
                    </div>
                )
            }
            <div className="user_page_header">
                <p>Tasdiqlangan mashinalar</p>
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
                                <b>Tasdiqlangan servislar</b>
                                {
                                    item.services_providing.filter(service => service.user_id === userId && service.status === "approved").map((service) => (
                                        <div key={service._id} className="service_card">
                                            <p>Servis: {services.find(s => s._id === service.service_id).service_name}</p>
                                            <p>Boshlangan sana: {moment(service.started_time).format("DD.MM.YYYY HH:mm")}</p>
                                            <p>Tugatilgan sana: {moment(service.ended_time).format("DD.MM.YYYY HH:mm")}</p>
                                            <p>Qabul qilingan sana: {moment(service.approved_time).format("DD.MM.YYYY HH:mm")}</p>
                                            <p>Muddat: {moment(service.end_time).format("DD.MM.YYYY")}</p>
                                            {/* <div className="service_actions">
                                                <button onClick={() => { setOpen(true); setSelectedProjectId(item._id); setSelectedServiceId(service._id) }}>
                                                    <FaCheck  />
                                                </button>
                                            </div> */}
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </div>
    );
};


export default Archived;