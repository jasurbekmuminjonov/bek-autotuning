import React, { useState } from 'react';
import { useCreateExpenseMutation, useDeleteExpenseMutation, useGetExpenseQuery, useUpdateExpenseMutation } from '../../context/services/spendings.service';
import { useForm } from 'react-hook-form';
import { message, Modal, Table } from 'antd';
import moment from 'moment';
import { MdDeleteForever, MdEdit } from 'react-icons/md';

const Spendings = () => {
    const { data: expenses = [] } = useGetExpenseQuery()
    const [createExpense] = useCreateExpenseMutation()
    const [deleteExpense] = useDeleteExpenseMutation()
    const [editExpense] = useUpdateExpenseMutation()
    const [selectedItem, setSelectedItem] = useState("")
    const { register, handleSubmit, reset } = useForm()
    const [open, setOpen] = useState(false)

    async function onSubmit(data) {
        try {
            if (selectedItem) {
                await editExpense({ body: data, expense_id: selectedItem })
            } else {
                await createExpense(data)
            }

            reset({
                expense_description: "",
                amount: null,
                expense_date: "",
            });

            setSelectedItem("")
            setOpen(false)
            message.success("Xarajat saqlandi")
        } catch (error) {
            message.error("Xatolik yuz berdi. Qaytadan urinib ko‘ring.")
            console.error(error)
        }
    }

    return (
        <div className='manager_page'>
            <div className="manager_page_header">
                <p>Xarajatlar</p>
                <div className="manager_page_header_actions">
                    <button onClick={() => {
                        setOpen(true)
                        reset({
                            expense_description: "",
                            amount: null,
                            expense_date: "",
                        })
                    }}>Yangi xarajat qo'shish</button>
                </div>
            </div>
            <Table pagination={{ pageSize: 10 }} dataSource={expenses} columns={[
                { title: "Xarajat tavsifi", dataIndex: "expense_description", key: "_id" },
                { title: "Xarajat summasi", dataIndex: "amount", key: "_id", render: (text) => text.toLocaleString() },
                { title: "Xarajat sanasi", dataIndex: "expense_date", key: "_id", render: (text) => moment(text).format("DD.MM.YYYY") },
                {
                    title: "Amallar", render: (_, record) => (
                        <div className='table_actions'>
                            <button onClick={() => {
                                setSelectedItem(record._id)
                                setOpen(true)
                                reset({
                                    ...record,
                                    expense_date: moment(record.expense_date).format("YYYY-MM-DD")
                                })
                            }}>
                                <MdEdit />
                            </button>

                            <button
                                onClick={async () => {
                                    try {
                                        await deleteExpense(record._id)
                                        message.success("Xarajat o'chirildi")
                                    } catch (error) {
                                        message.error("Xarajatni o‘chirishda xatolik yuz berdi")
                                        console.error(error)
                                    }
                                }}
                            >
                                <MdDeleteForever />
                            </button>

                        </div>
                    )
                }
            ]} />
            <Modal open={open} onCancel={() => {
                setOpen(false);
                reset({
                    expense_description: "",
                    amount: null,
                    expense_date: "",
                })
            }} footer={[]} title={selectedItem ? "Xarajatni tahrirlash" : "Xarajat qo'shish"}>
                <form autoComplete='off' className="modal_form" onSubmit={handleSubmit(onSubmit)}>
                    <label htmlFor="amount">
                        <p>Xarajat summasi</p>
                        <input type="number" {...register("amount", { required: "Summani kiriting" })} id="amount" />
                    </label>
                    <label htmlFor="expense_description">
                        <p>Xarajat tavsifi</p>
                        <input type="text" {...register("expense_description", { required: "Tavsifni kiriting" })} id="expense_description" />
                    </label>
                    <label htmlFor="expense_date">
                        <p>Xarajat sanasi</p>
                        <input type="date" {...register("expense_date", { required: "Sanani tanlang" })} id="expense_date" />
                    </label>
                    <button>Saqlash</button>
                </form>
            </Modal>
        </div>
    );
};


export default Spendings;