import React, { useState } from 'react';
import { FaList, FaPlus } from 'react-icons/fa';
import { message, Modal, Popover, Table, Tooltip } from 'antd';
import { MdDeleteForever, MdEdit } from 'react-icons/md';
import { useGetServiceQuery } from '../../context/services/service.service';
import moment from 'moment';
import { useForm, Controller } from 'react-hook-form';
import dayjs from 'dayjs';
import { TimePicker } from 'antd';
import { useCreateUserMutation, useEditUserMutation, useGetUsersQuery, useLazyGetAllUserProjectsQuery, useLazyGetUserProjectsQuery } from '../../context/services/user.service';
import { useGetProjectsQuery } from '../../context/services/project.service';

const Users = () => {
    const { data: users = [] } = useGetUsersQuery()
    const { data: services = [] } = useGetServiceQuery()
    const [createUser] = useCreateUserMutation()
    const [editUser] = useEditUserMutation()
    const [fetchUserProjects, { data, error, isLoading }] = useLazyGetUserProjectsQuery();
    const [fetchAllUserProjects, { data: allUserProjects = [] }] = useLazyGetAllUserProjectsQuery();
    const { data: projects = [] } = useGetProjectsQuery();
    const [open, setOpen] = useState(false);
    const [listUser, setListUser] = useState("");
    const { register, handleSubmit, reset, formState: { errors }, control } = useForm()
    const [visible, setVisible] = useState(false);
    const [editingUser, setEditingUser] = useState("");
    const columns = [
        { title: "Ism", dataIndex: "name", key: "name" },
        { title: "Login", dataIndex: "login", key: "login" },
        { title: "Ish boshlash vaqti", dataIndex: "start_time", key: "start_time" },
        { title: "Ish tugatish vaqti", dataIndex: "end_time", key: "end_time" },
        { title: "Balans", dataIndex: "balance", key: "balance" },
        {
            title: "Amallar", key: "actions", render: (_, record) => (
                <div className="table_actions">
                    <button onClick={() => { fetchAllUserProjects(record._id); setOpen(true); setListUser(record._id) }}>
                        <FaList />
                    </button>
                    <button onClick={() => {
                        setVisible(true);
                        setEditingUser(record._id);
                        reset({
                            ...record, password: null, start_time: record.start_time ? dayjs(record.start_time, "HH:mm") : null,
                            end_time: record.end_time ? dayjs(record.end_time, "HH:mm") : null,
                        });
                    }}>
                        <MdEdit />
                    </button>
                    {/* <button>
                        <MdDeleteForever />
                    </button> */}
                </div>
            )
        },
    ]
    const status = {
        pending: "Kutilmoqda",
        inprogress: "Jarayonda",
        finished: "Tugatildi",
        approved: "Tasdiqlandi",
        rejected: "Tasdiqlanmadi",
    }
    const projectsColumns = [
        { title: "Mashina nomi", dataIndex: "car_name", key: "car_name" },
        { title: "Mashina raqami", dataIndex: "car_number", key: "car_number" },
        { title: "Klent ismi", dataIndex: "client_name", key: "client_name" },
        { title: "Klent raqami", dataIndex: "client_phone", key: "client_phone" },
        { title: "Holat", dataIndex: "status", render: (text) => status[text] },
        {
            title: "Servis",
            render: (_, record) => (
                <div className="table_actions">
                    <Popover
                        placement="bottom"
                        title={"Ishchining mashinadagi servislari"}
                        content={
                            <Table
                                dataSource={record.services_providing.filter(s => s.user_id === listUser)}
                                columns={tooltipColumns}
                            />
                        }
                    >
                        <button>
                            <FaList />
                        </button>
                    </Popover>
                </div>
            )
        }

    ]
    const tooltipColumns = [
        { title: "Servis", dataIndex: "service_id", key: "service_id", render: (text) => services.find(s => s._id === text).service_name },
        { title: "Maosh", dataIndex: 'user_salary_amount', key: 'user_salary_amount', render: (text) => text.amount.toLocaleString() },
        { title: "Holat", dataIndex: "status", render: (text) => status[text] },
        { title: "Boshlash sanasi", dataIndex: "start_time", key: "start_time", render: (text) => moment(text).format('YYYY-MM-DD') },
        { title: "Tugatish sanasi", dataIndex: "end_time", key: "end_time", render: (text) => moment(text).format('YYYY-MM-DD') }
    ]

    async function submitForm(data) {
        try {

            data.start_time = typeof data.start_time === "string"
                ? data.start_time
                : dayjs(data.start_time).format("HH:mm");

            data.end_time = typeof data.end_time === "string"
                ? data.end_time
                : dayjs(data.end_time).format("HH:mm");

            console.log(data);
            if (editingUser) {
                editUser({ body: data, user_id: editingUser })
            } else {
                createUser(data)
            }
            setVisible(false);
            reset({ name: "", login: "", password: "", start_time: "", end_time: "" });
            setEditingUser("")
            message.success("Ishchi saqlandi!");
        } catch (error) {
            console.error(error);
            message.error("Xatolik yuz berdi!");
        }
    }


    return (
        <div className='manager_page'>
            <Modal open={visible} title={editingUser ? "Ishchini tahrirlash" : "Ishchi qo'shish"} footer={[]} onCancel={() => {
                setVisible(false);
                reset({ name: "", login: "", password: "", start_time: "", end_time: "" });
            }}>
                <form onSubmit={handleSubmit(submitForm)} className="modal_form">
                    <input type="text" {...register("name", { required: "Ismni kiriting" })} placeholder='Ishchi ismi' />
                    {errors.name && <span className='error'>{errors.name.message}</span>}

                    <input type="text" {...register("login", { required: "Login kiriting" })} placeholder='Ishchi logini' />
                    {errors.login && <span className='error'>{errors.login.message}</span>}

                    <input type="text" {...register("password", !editingUser ? { required: "Parol kiriting" } : {})}
                        placeholder='Ishchi paroli' />
                    {errors.password && <span className='error'>{errors.password.message}</span>}

                    <Controller
                        name="start_time"
                        control={control}
                        rules={{ required: "Boshlanish vaqtini tanlang" }}
                        render={({ field }) => (
                            <TimePicker
                                {...field}
                                format="HH:mm"
                                placeholder="Boshlanish vaqti"
                                onChange={(time) => field.onChange(time ? time.format("HH:mm") : null)}
                                value={field.value ? dayjs(field.value, "HH:mm") : null}
                            />
                        )}
                    />
                    {errors.start_time && <span className='error'>{errors.start_time.message}</span>}

                    <Controller
                        name="end_time"
                        control={control}
                        rules={{ required: "Tugash vaqtini tanlang" }}
                        render={({ field }) => (
                            <TimePicker
                                {...field}
                                format="HH:mm"
                                placeholder="Tugash vaqti"
                                onChange={(time) => field.onChange(time ? time.format("HH:mm") : null)}
                                value={field.value ? dayjs(field.value, "HH:mm") : null}
                            />
                        )}
                    />
                    {errors.end_time && <span className='error'>{errors.end_time.message}</span>}


                    <button type="submit">Saqlash</button>
                </form>
            </Modal>
            <Modal width={900} open={open} onCancel={() => setOpen(false)} footer={[]} title="Ishchining barcha mashinalari">
                <Table size='middle' pagination={{ pageSize: 10 }} dataSource={allUserProjects} columns={projectsColumns} />
            </Modal>
            <div className="manager_page_header">
                <p>Ishchilar</p>
                <div className="manager_page_header_actions">
                    <button onClick={() => {
                        setVisible(true);
                        reset({ name: "", login: "", password: "", start_time: "", end_time: "" });
                        setEditingUser("");
                    }}>
                        <FaPlus />
                        Ishchi qo'shish
                    </button>
                </div>
            </div>
            <Table dataSource={users} columns={columns} />
        </div>
    );
};

export default Users;