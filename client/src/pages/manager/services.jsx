import { Button, Input, message, Modal, Table } from 'antd';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { MdDeleteForever, MdEdit } from 'react-icons/md';
import { useCreateServiceMutation, useDeleteServiceMutation, useGetServiceQuery, useUpdateServiceMutation } from '../../context/services/service.service';
import { FaPlus } from 'react-icons/fa';

const Services = () => {
    const { data: allServices = [] } = useGetServiceQuery()
    const [createService] = useCreateServiceMutation()
    const [deleteService] = useDeleteServiceMutation()
    const [updateService] = useUpdateServiceMutation()
    const { register, handleSubmit, reset, formState: { errors } } = useForm()
    const [open, setOpen] = useState(false);
    const [editingService, setEditingService] = useState("")
    console.log(editingService);

    const columns = [
        { title: "Servis nomi", dataIndex: "service_name", key: "service_name" },
        {
            title: "Amallar", render: (_, record) => (
                <div className="table_actions">
                    <button onClick={() => {
                        setEditingService(record._id);
                        setOpen(true);
                        reset({ service_name: record.service_name });
                    }}>
                        <MdEdit />
                    </button>
                    <button onClick={async () => {
                        try {
                            await deleteService({ service_id: record._id }).unwrap();;
                            message.success("Servis o'chirildi");
                        } catch (err) {
                            console.error(err);
                            message.error("Xatolik yuz berdi");
                        }
                    }}>
                        <MdDeleteForever />
                    </button>
                </div>
            )
        }
    ]

    async function submitForm(data) {
        try {
            console.log(data);
            if (editingService) {
                updateService({ body: data, service_id: editingService }).unwrap();
            } else {
                createService(data).unwrap();
            }
            reset({ service_name: "" });
            setOpen(false);
            message.success(editingService ? "Servisni tahrirlandi" : "Servis qo'shildi");
        } catch (err) {
            console.log(err);
            message.error("Xatolik yuz berdi");
        }
    }

    return (
        <div className='manager_page'>
            <Modal open={open} onCancel={() => { setOpen(false); reset({ service_name: "" }) }} title={editingService ? "Servisni tahrirlash" : "Servis qo'shish"} footer={[]}>
                <form className='modal_form' autoComplete='off' onSubmit={handleSubmit(submitForm)}>
                    <input placeholder='Servis nomi' {...register("service_name", { required: 'Servis nomini kiriting' })} />
                    {errors.service_name && <span style={{ fontSize: "18px" }} className='error'>{errors.service_name.message}</span>}
                    <button type="primary" htmlType="submit">{editingService ? "Tahrirlash" : "Qo'shish"}</button>
                </form>
            </Modal>
            <div className="manager_page_header">
                <p>Servislar</p>
                <div className="manager_page_header_actions">
                    <button onClick={() => { setOpen(true); setEditingService("") }}>
                        <FaPlus />
                        Servis qo'shish
                    </button>
                </div>
            </div>
            <Table dataSource={allServices} columns={columns} />

        </div>
    );
};


export default Services;