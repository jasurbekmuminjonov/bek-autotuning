import React, { useEffect, useState } from 'react';
import { useApproveProjectMutation, useFinishProjectMutation, useGetProjectsForApproveQuery, useGetProjectsQuery, useRejectProjectMutation } from '../../context/services/project.service';
import { useGetServiceQuery } from '../../context/services/service.service';
import moment from 'moment';
import { FaCheck } from 'react-icons/fa';
import { message } from 'antd';
import { useGetUsersQuery } from '../../context/services/user.service';
import { FaX } from 'react-icons/fa6';
import emptyImg from '../../assets/empty.png';
const Approve = () => {
    const { data: projects = [] } = useGetProjectsForApproveQuery()
    const { data: users = [] } = useGetUsersQuery()
    const { data: services = [] } = useGetServiceQuery()
    const [approveProject] = useApproveProjectMutation()
    const [rejectProject] = useRejectProjectMutation()
    const [selectedServiceId, setSelectedServiceId] = useState("");
    const [selectedProjectId, setSelectedProjectId] = useState("");
    const [startingProjectId, setStartingProjectId] = useState("");
    const [open, setOpen] = useState(false);
    const [rejectOpen, setRejectOpen] = useState(false);
    const [userProjects, setUserProjects] = useState([])
    const userId = localStorage.getItem('user_id') || null
    if (!userId) {
        localStorage.clear()
        window.location.href = '/'
    }
    useEffect(() => {
        // const filtered = projects.filter(project =>
        //     project.services_providing.some(service => service.user_id === userId && service.status === "inprogress")
        // );
        // setUserProjects(filtered)
        setUserProjects(projects)
    }, [projects, userId])

    const handleApprove = async () => {
        try {
            approveProject({ project_id: selectedProjectId, approving_service: selectedServiceId, starting_service: startingProjectId })
            setOpen(false)
            message.success("Servis qabul qilindi")
        } catch (err) {
            console.log(err)
            message.error("Xatolik yuz berdi")
        }
    }
    const handleReject = async () => {
        try {
            rejectProject({ project_id: selectedProjectId, rejecting_service: selectedServiceId })
            setRejectOpen(false)
            message.success("Servis rad etildi")
        } catch (err) {
            console.log(err)
            message.error("Xatolik yuz berdi")
        }
    }


    if (userProjects.length < 1) {
        return (
            <div className="user_page">
                <div className="user_page_header">
                    <p>Servisni tasdiqlash</p>
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

                            <p>Chindan ham servisni qabul qilasizmi?</p>
                        </div>
                        <div className="confirm_body">
                            <p>Ushbu holatda ushbu servis holati 'tasdiqlangan' deb belgilanadi va undan keyingi servis, ya'ni sizning servisingiz 'jarayonda' holatiga o'tadi</p>
                        </div>
                        <div className="confirm_footer">
                            <button onClick={() => setOpen(false)} style={{ background: "#1677ff", color: "#fff" }}>Orqaga</button>
                            <button onClick={handleApprove}>Tasdiqlash</button>
                        </div>
                    </div>
                )
            }
            {
                rejectOpen && (
                    <div className="confirm">
                        <div className="confirm_title">

                            <p>Chindan ham servisni rad etasizmi?</p>
                        </div>
                        <div className="confirm_body">
                            <p>Ushbu holatda ushbu servis holati 'rad etilgan' deb belgilanadi va servis ishchisining 'jarayondagi servislar' bo'limiga qo'shiladi</p>
                        </div>
                        <div className="confirm_footer">
                            <button onClick={() => setRejectOpen(false)} style={{ background: "#1677ff", color: "#fff" }}>Orqaga</button>
                            <button onClick={handleReject}>Tasdiqlash</button>
                        </div>
                    </div>
                )
            }
            <div className="user_page_header">
                <p>Servisni tasdiqlash</p>
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
                                <b>Qabul qilish uchun servislar</b>
                                {
                                    item.services_providing.filter(service => service.status === "finished").map((service) => (
                                        <div key={service._id} className="service_card">
                                            <p>Servis: {services.find(s => s._id === service.service_id).service_name}</p>
                                            <p>Servis ishchisi: {users.find(s => s._id === service.user_id)?.name}</p>
                                            <p>Sizning servis: {services.find(s => s._id === item.services_providing.find(s => s.index === service.index + 1).service_id).service_name}</p>
                                            <p>Tugatilgan sana: {moment(service.ended_time).format("DD.MM.YYYY HH:mm")}</p>
                                            <div className="service_actions">
                                                <button onClick={() => { setOpen(true); setStartingProjectId(item.services_providing.find(s => s.index === service.index + 1)._id); setSelectedProjectId(item._id); setSelectedServiceId(service._id) }}>
                                                    <FaCheck />
                                                </button>
                                                <button style={{ background: "#bd282b" }} onClick={() => { setRejectOpen(true); setSelectedProjectId(item._id); setSelectedServiceId(service._id) }}>
                                                    <FaX />
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
        </div>
    );
};


export default Approve;