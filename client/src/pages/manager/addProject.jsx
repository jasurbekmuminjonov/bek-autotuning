import React, { useEffect } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FaChevronLeft, FaStarOfLife } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateProjectMutation, useEditProjectMutation, useGetProjectsQuery } from '../../context/services/project.service';
import { useGetServiceQuery } from '../../context/services/service.service';
import { useGetUsersQuery } from '../../context/services/user.service';
import { message } from 'antd';

const AddProject = () => {
    const { id } = useParams()
    const { data: users = [] } = useGetUsersQuery()
    const { data: projects = [] } = useGetProjectsQuery()
    const navigate = useNavigate()
    const [createProject] = useCreateProjectMutation()
    const [editProject] = useEditProjectMutation()
    const { data: services = [] } = useGetServiceQuery()

    const { register, handleSubmit, reset, formState: { errors }, control } = useForm()
    const { fields, append, remove } = useFieldArray({
        control,
        name: "services_providing",
    });
    useEffect(() => {
        if (id) {
            const project = projects?.find(project => project._id === id);
            if (project) {
                reset({
                    ...project,
                    leave_date: project.leave_date ? new Date(project.leave_date).toISOString().split('T')[0] : "",

                    services_providing: project.services_providing?.map(service => ({
                        ...service,
                        start_time: service.start_time ? new Date(service.start_time).toISOString().split('T')[0] : "",
                        end_time: service.end_time ? new Date(service.end_time).toISOString().split('T')[0] : "",
                    })) || []
                });
            }
        }
    }, [id, projects, reset]);


    const onSubmit = async (data) => {
        try {
            const formattedData = {
                ...data,
                services_providing: data.services_providing.map(service => ({
                    ...service,
                    amount_to_paid: {
                        ...service.amount_to_paid,
                        amount: Number(service.amount_to_paid.amount),
                    },
                    user_salary_amount: {
                        ...service.user_salary_amount,
                        amount: Number(service.user_salary_amount.amount),
                    },
                    spendings: service.spendings.map(spending => ({
                        ...spending,
                        amount: {
                            ...spending.amount,
                            amount: Number(spending.amount.amount),
                        }
                    }))
                }))
            };

            if (id) {
                editProject({ body: formattedData, project_id: id });
            } else {
                createProject(formattedData)
            }
            message.success("Mashina saqlandi")
            navigate("/")
        }
        catch (error) {
            console.error(error);
            message.error("Xatolik yuz berdi")
        }
    }

    return (
        <div className='manager_page'>
            {
                id && <button onClick={() => navigate(-1)}><FaChevronLeft /></button>
            }

            <div className="manager_page_header">
                <p>{id ? "Mashinani tahrirlash" : "Yangi mashina qo'shish"}</p>
                <div className="manager_page_header_actions">
                </div>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="addproject_form">
                <div className="forms">

                    <div className="form_part">
                        <p>Klent ma'lumotlari</p>
                        <label htmlFor="client_name">
                            <p>
                                <FaStarOfLife size={8} />
                                Klent ismi
                            </p>
                            <input {...register("client_name", { required: "Klent ismini kiriting" })} type="text" id="client_name" />
                        </label>
                        <label htmlFor="client_phone">
                            <p>
                                <FaStarOfLife size={8} />
                                Klent tel raqami
                            </p>
                            <input
                                id='client_phone'
                                placeholder='Format: 991112233'
                                {...register("client_phone", { required: "Klent tel raqamni kiriting", minLength: { value: 9, message: "Talab etiladigan format: 991112233" }, maxLength: { value: 9, message: "Talab etiladigan format: 991112233" } })}
                                type="number"
                                onwheel="event.preventDefault();"
                            />
                        </label>
                        <p>Mashina ma'lumotlari</p>
                        <label htmlFor="car_name">
                            <p>
                                <FaStarOfLife size={8} />
                                Mashina nomi
                            </p>
                            <input {...register("car_name", { required: "Mashina nomini kiriting" })} type="text" id="car_name" />
                        </label>
                        <label htmlFor="car_number">
                            <p>
                                <FaStarOfLife size={8} />
                                Mashina raqami
                            </p>
                            <input onwheel="event.preventDefault();"  {...register("car_number", { required: "Mashina raqamini kiriting" })} type="text" id="car_number" />
                        </label>
                        <label htmlFor="currency">
                            <p>
                                <FaStarOfLife size={8} />
                                Afzal valyuta
                            </p>
                            <select disabled={id} {...register("currency", { required: "Valyutani tanlang" })} id="currency">
                                <option value="USD">USD</option>
                                <option value="UZS">UZS</option>
                            </select>
                        </label>
                        <label htmlFor="leave_date">
                            <p>
                                <FaStarOfLife size={8} />
                                Mashinaning chiqib ketish sanasi</p>
                            <input {...register("leave_date", { required: "Chiqib ketish sanasini kiriting" })} type="date" id="leave_date" />
                        </label>

                    </div>
                    <div className="form_part">
                        <p>Ko'rsatiladigan servislar</p>
                        {fields.map((item, index) => (
                            <div className='service' key={item.id}>
                                <label>
                                    Servis:
                                    <select {...register(`services_providing.${index}.service_id`, { required: "Servisni tanlang" })}>
                                        {
                                            services?.map((service) => (
                                                <option key={service._id} value={service._id}>{service.service_name}</option>
                                            ))
                                        }
                                    </select>
                                </label>

                                <label>
                                    Ishchi:
                                    <select {...register(`services_providing.${index}.user_id`, { required: "Ishchini tanlang" })}>
                                        {
                                            users?.map((user) => (
                                                <option key={user._id} value={user._id}>{user.name}</option>
                                            ))
                                        }
                                    </select>
                                </label>

                                <label>
                                    Xizmat narxi:
                                    <input {...register(`services_providing.${index}.amount_to_paid.amount`)} type="number" onwheel="event.preventDefault();" />
                                    <select {...register(`services_providing.${index}.amount_to_paid.currency`)}>
                                        <option value="UZS">UZS</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </label>

                                <label>
                                    Ishchining maoshi:
                                    <input {...register(`services_providing.${index}.user_salary_amount.amount`)} type="number" onwheel="event.preventDefault();" />
                                </label>

                                <label>
                                    Boshlash sanasi:
                                    <input {...register(`services_providing.${index}.start_time`)} type="date" />
                                </label>

                                <label>
                                    Tugash sanasi:
                                    <input {...register(`services_providing.${index}.end_time`)} type="date" />
                                </label>

                                <h4>Harajatlar</h4>
                                <SpendingsFieldArray control={control} parentIndex={index} register={register} />

                                <label>
                                    Tartib raqami:
                                    <input {...register(`services_providing.${index}.index`)} type="number" onwheel="event.preventDefault();" defaultValue={index + 1} />
                                </label>

                                <button type="button" onClick={() => remove(index)}>O‘chirish</button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() =>
                                append({
                                    user_id: "",
                                    amount_to_paid: { amount: 0, currency: "UZS" },
                                    user_salary_amount: { amount: 0, currency: "UZS" },
                                    spendings: [],
                                    service_id: "",
                                    start_time: "",
                                    end_time: "",
                                    status: "pending",
                                    index: fields.length + 1,
                                })
                            }
                        >
                            Xizmat qo‘shish
                        </button>
                    </div>

                </div>
                <button type="submit">Saqlash</button>

            </form>
        </div>
    );
};
const SpendingsFieldArray = ({ control, parentIndex, register }) => {
    const { fields, append, remove } = useFieldArray({
        control,
        name: `services_providing.${parentIndex}.spendings`,
    });

    return (
        <>
            {fields.map((item, index) => (
                <div className='spending' key={item.id}>
                    <label>
                        Harajat miqdori:
                        <input {...register(`services_providing.${parentIndex}.spendings.${index}.amount.amount`)} type="number" onwheel="event.preventDefault();" />
                        <select {...register(`services_providing.${parentIndex}.spendings.${index}.amount.currency`)}>
                            <option value="UZS">UZS</option>
                            <option value="USD">USD</option>
                        </select>
                    </label>

                    <label>
                        Tavsif:
                        <input {...register(`services_providing.${parentIndex}.spendings.${index}.description`)} type="text" />
                    </label>

                    <button type="button" onClick={() => remove(index)}>Harajatni o‘chirish</button>
                </div>
            ))}

            <button type="button" onClick={() => append({ amount: { amount: 0, currency: "UZS" }, description: "" })}>Harajat qo‘shish</button>
        </>
    );
};

export default AddProject;
