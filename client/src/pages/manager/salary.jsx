import React, { useState, useEffect } from 'react';
import { useGetUsersQuery } from '../../context/services/user.service';
import { useCreateSalaryMutation, useDeleteSalaryMutation, useLazyGetApprovedProjectsQuery, useUpdateSalaryMutation } from '../../context/services/salary.service';
import moment from 'moment';
import { message, Modal, Popover, Table } from 'antd';
import { FaDollarSign, FaList } from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import { MdDeleteForever, MdEdit } from 'react-icons/md';

const Salary = () => {
    const [filters, setFilters] = useState({
        month: moment().format("YYYY-MM"),
        searchTerm: ""
    });
    const [createSalary] = useCreateSalaryMutation()
    const [editSalary] = useUpdateSalaryMutation()
    const [deleteSalary] = useDeleteSalaryMutation()
    const [selectedUser, setSelectedUser] = useState("")
    const [editingUser, setEditingUser] = useState("")
    const [editingSalary, setEditingSalary] = useState("")
    const [open, setOpen] = useState(false)
    const { register, handleSubmit, reset } = useForm()
    const [totalSalaries, setTotalSalaries] = useState({});
    const [fetchApprovedProjects] = useLazyGetApprovedProjectsQuery();

    const { data: users = [] } = useGetUsersQuery();
    async function onSubmit(data) {
        try {
            if (editingUser) {
                await editSalary({
                    body: {
                        amount: Number(data.amount),
                        paycheck_date: data.paycheck_date
                    },
                    user_id: editingUser,
                    salary_id: editingSalary

                });
            } else {
                await createSalary({
                    body: {
                        amount: Number(data.amount),
                        paycheck_date: data.paycheck_date
                    },
                    user_id: selectedUser
                });
            }
            setSelectedUser("")
            setEditingSalary("")
            setEditingUser("")
            reset({
                amount: null,
                paycheck_date: moment().format("YYYY-MM-DD")
            });
            setOpen(false);
            message.success("Maosh berildi");
        } catch (error) {
            console.error(error);
            message.error("Maosh berishda xatolik yuz berdi");
        }
    }

    useEffect(() => {
        const calculateSalaries = async () => {
            const salaries = {};
            for (const user of users) {
                try {
                    const { data: allProjects = [] } = await fetchApprovedProjects(user._id);
                    const filteredProjects = allProjects?.filter(p =>
                        filters.month ? moment(p.approved_time).format("YYYY-MM") === filters.month : true
                    );
                    const totalSalary = filteredProjects.reduce((acc, curr) =>
                        acc + curr.services_providing
                            .filter(c => c.user_id === user._id)
                            .reduce((a, b) => a + b.user_salary_amount.amount, 0), 0
                    );

                    salaries[user._id] = totalSalary;
                } catch (err) {
                    console.error("Error fetching salaries:", err);
                }
            }
            setTotalSalaries(salaries);
        };
        if (users.length > 0) {
            calculateSalaries();
        }
    }, [users, filters.month, fetchApprovedProjects]);

    const columns = [
        { title: "Ishchi", dataIndex: "name", key: "_id" },
        {
            title: "Hisoblangan oylik",
            render: (_, record) => totalSalaries[record._id]?.toLocaleString() + " UZS" || 0
        },
        {
            title: "Berilgan oylik",
            render: (_, record) => (
                record?.paychecks.filter(p => filters.month ? moment(p.paycheck_date).format("YYYY-MM") === filters.month : true).reduce((acc, p) => acc + p.amount, 0)?.toLocaleString() + " UZS" || 0
            )
        },
        {
            title: "Qolgan oylik",
            render: (_, record) => (
                (totalSalaries[record._id] - record?.paychecks.filter(p => filters.month ? moment(p.paycheck_date).format("YYYY-MM") === filters.month : true).reduce((acc, p) => acc + p.amount, 0))?.toLocaleString() + " UZS" || 0
            )
        },
        {
            title: "Amallar",
            render: (_, record) => (
                <div className='table_actions'>
                    <Popover placement='bottom' title={"Berilgan oyliklar"} content={
                        <Table dataSource={record?.paychecks.filter(p => filters.month ? moment(p.paycheck_date).format("YYYY-MM") === filters.month : true)} columns={[
                            { title: "Summa", dataIndex: "amount", key: "_id", render: (text) => text.toLocaleString() + " UZS" },
                            { title: "Sanasi", dataIndex: "paycheck_date", key: "_id", render: (text) => moment(text).format("DD.MM.YYYY") },
                            {
                                title: "Amallar", render: (_, salaryRecord) => (
                                    <div className="table_actions">
                                        <button onClick={() => {
                                            setEditingSalary(salaryRecord._id)
                                            setEditingUser(record._id)
                                            reset({
                                                amount: salaryRecord.amount,
                                                paycheck_date: moment(salaryRecord.paycheck_date).format("YYYY-MM-DD")
                                            })
                                            setOpen(true)
                                        }}>
                                            <MdEdit />
                                        </button>
                                        <button onClick={() => {
                                            deleteSalary({ user_id: record._id, salary_id: salaryRecord._id })
                                        }}>
                                            <MdDeleteForever />
                                        </button>
                                    </div>
                                )
                            }
                        ]} />
                    }>
                        <button>
                            <FaList />
                        </button>
                    </Popover>
                    <button onClick={() => {
                        setSelectedUser(record._id)
                        setOpen(true)
                    }}>
                        <FaDollarSign />
                    </button>
                </div>
            )
        }
    ];
    return (
        <div className='manager_page'>
            <Modal open={open} footer={[]} title="Maosh berilganligi qayd etish" onCancel={() => { setSelectedUser(""); setOpen(false) }}>
                <form onSubmit={handleSubmit(onSubmit)} className="modal_form">
                    <label htmlFor="amount">
                        <p>Maosh summasi(UZS)</p>
                        <input {...register("amount", { required: "Summani kiriting" })} type="number" id="amount" />
                    </label>
                    <label htmlFor="paycheck_date">
                        <p>Sana</p>
                        <input type="date" {...register("paycheck_date", { required: "Sanani tanlang" })} id="paycheck_date" defaultValue={moment().format("YYYY-MM-DD")} />
                    </label>
                    <button>Saqlash</button>
                </form>
            </Modal>
            <div className="manager_page_header">
                <p>Ishchilarning oyligini hisoblash</p>
                <div className="manager_page_header_actions">
                    <input
                        value={filters.month}
                        type="month"
                        onChange={(e) => setFilters({ ...filters, month: e.target.value })}
                    />
                    <input
                        type="search"
                        onChange={(e) => setFilters({ ...filters, searchTerm: e.target.value })}
                        placeholder='Ishchining ismi orqali qidirish'
                    />
                </div>
            </div>
            <Table
                columns={columns}
                dataSource={users.map(user => ({ ...user, key: user._id }))}
            />
        </div>
    );
};

export default Salary;
