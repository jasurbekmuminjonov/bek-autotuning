import React, { useEffect, useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { FaChevronLeft, FaStarOfLife, FaUpload } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { useCreateProjectMutation, useEditProjectMutation, useGetProjectsQuery } from '../../context/services/project.service';
import { useGetServiceQuery } from '../../context/services/service.service';
import { useGetUsersQuery } from '../../context/services/user.service';
import { Button, message, Upload } from 'antd';
import axios from 'axios';

const AddProject = () => {
    const { id } = useParams()
    const { data: users = [] } = useGetUsersQuery()
    const { data: projects = [] } = useGetProjectsQuery()
    const navigate = useNavigate()
    const [createProject] = useCreateProjectMutation()
    const [editProject] = useEditProjectMutation()
    const { data: services = [] } = useGetServiceQuery()
    const [frontImage, setFrontImage] = useState("")
    const [backImage, setBackImage] = useState("")
    const [rightImage, setRightImage] = useState("")
    const [leftImage, setLeftImage] = useState("")
    const { register, handleSubmit, reset, formState: { errors }, control, watch } = useForm()
    // const [salaryType, setSalaryType] = useState("salary")
    const isFree = watch("isFree", false);
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
                // setSalaryType(project.salaryType)
                setFrontImage(project.front_image)
                setBackImage(project.back_image)
                setRightImage(project.right_image)
                setLeftImage(project.left_image)
            }
        }
    }, [id, projects, reset]);


    const onSubmit = async (data) => {
        try {
            const formattedData = {
                ...data,
                front_image: frontImage,
                back_image: backImage,
                right_image: rightImage,
                left_image: leftImage,
                total_profit: Number(data.total_profit),
                services_providing: data.services_providing.map(service => ({
                    ...service,
                    amount_to_paid: {
                        ...service.amount_to_paid,
                        amount: Number(service.amount_to_paid.amount),
                    },
                    // extra_profit: {
                    //     ...service.extra_profit,
                    //     amount: Number(service.extra_profit.amount),
                    // },
                    // user_salary_amount: {
                    //     ...service.user_salary_amount,
                    //     amount: Number(service.user_salary_amount.amount),
                    // },
                    // spendings: service.spendings.map(spending => ({
                    //     ...spending,
                    //     amount: {
                    //         ...spending.amount,
                    //         amount: Number(spending.amount.amount),
                    //     }
                    // }))
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

    const handleUpload = async (file, setImageUrl) => {
        const formData = new FormData();
        formData.append("image", file);
        formData.append("key", "65384e0beb6c45b817d791e806199b7e");

        try {
            const response = await axios.post(
                "https://api.imgbb.com/1/upload",
                formData
            );
            const url = response.data.data.url;
            setImageUrl(url);
            message.success("Rasm muvaffaqiyatli yuklandi!");
        } catch (error) {
            console.error("Yuklashda xatolik:", error);
            message.error("Rasmni yuklashda xatolik yuz berdi.");
        }
    };
    console.log(errors);


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
            <form autoComplete='off' onSubmit={handleSubmit(onSubmit)} className="addproject_form">
                <div className="forms">
                    <div className="form_part">
                        <label htmlFor="client_name">
                            <p>
                                <FaStarOfLife size={8} />
                                Klent ismi
                            </p>
                            <input {...register("client_name", { required: "Klent ismini kiriting" })} type="text" id="client_name" />
                            {errors.client_name && <span style={{ color: 'red' }}>{errors.client_name.message}</span>}
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
                                onWheel={(e) => {
                                    e.preventDefault();
                                }}
                            />
                            {errors.client_phone && <span style={{ color: 'red' }}>{errors.client_phone.message}</span>}
                        </label>
                        <label htmlFor="car_name">
                            <p>
                                <FaStarOfLife size={8} />
                                Mashina nomi
                            </p>
                            <input {...register("car_name", { required: "Mashina nomini kiriting" })} type="text" id="car_name" />
                            {errors.car_name && <span style={{ color: 'red' }}>{errors.car_name.message}</span>}
                        </label>
                        <label htmlFor="car_number">
                            <p>
                                <FaStarOfLife size={8} />
                                Mashina raqami
                            </p>
                            <input onWheel={(e) => {
                                e.preventDefault();
                            }}  {...register("car_number", { required: "Mashina raqamini kiriting" })} type="text" id="car_number" />
                            {errors.car_number && <span style={{ color: 'red' }}>{errors.car_number.message}</span>}
                        </label>
                        <label htmlFor="car_id">
                            <p>
                                <FaStarOfLife size={8} />
                                Mashina ID si
                            </p>
                            <input onWheel={(e) => {
                                e.preventDefault();
                            }}  {...register("car_id", { required: "Mashina ID sini kiriting" })} type="text" id="car_id" />
                            {errors.car_id && <span style={{ color: 'red' }}>{errors.car_id.message}</span>}
                        </label>

                        <label htmlFor="total_profit">
                            <p>
                                <FaStarOfLife size={8} />
                                Kelishuv summasi
                            </p>
                            <input type="number" id="total_profit" {...register("total_profit", { required: "Kelishuv summasini kiriting" })} />
                            {errors.total_profit && <span style={{ color: 'red' }}>{errors.total_profit.message}</span>}
                        </label>
                        <label htmlFor="currency">
                            <p>
                                <FaStarOfLife size={8} />
                                Afzal valyuta
                            </p>
                            <select disabled={id || isFree} {...register("currency", { required: "Valyutani tanlang" })} id="currency">
                                <option value="USD">USD</option>
                                <option value="UZS">UZS</option>
                            </select>
                            {errors.currency && <span style={{ color: 'red' }}>{errors.currency.message}</span>}
                        </label>
                        <label htmlFor="leave_date">
                            <p style={{ fontSize: "14px" }}>
                                <FaStarOfLife size={8} />
                                Mashinaning chiqib ketish sanasi</p>
                            <input {...register("leave_date", { required: "Chiqib ketish sanasini kiriting" })} type="date" id="leave_date" />
                            {errors.leave_date && <span style={{ color: 'red' }}>{errors.leave_date.message}</span>}
                        </label>
                        <label style={{ flexDirection: "row", alignItems: "center", gap: "12px" }} htmlFor="isFree">
                            <p>Bepul</p>
                            <input style={{ width: "20px" }} type="checkbox" {...register("isFree")} id="isFree" />
                        </label>
                    </div>
                    <div className="form_part" style={{ flexGrow: 1, flexDirection: "row", flexWrap: "wrap" }}>
                        <label htmlFor="front_image" style={{ width: "250px" }}>
                            <p>
                                <FaStarOfLife size={8} />
                                Mashinaning old rasmi
                            </p>
                            <Upload
                                customRequest={({ file }) => handleUpload(file, setFrontImage)}
                                showUploadList={false}
                            >
                                <Button style={{ width: "250px", height: "35px", border: "1px solid #ccc", borderRadius: "0" }}>
                                    <FaUpload /> Rasmni tanlash
                                </Button>
                            </Upload>
                            {frontImage && (
                                <div style={{ width: "100%" }}>
                                    <p>Yuklangan rasm:</p>
                                    <img style={{ width: "100%", objectFit: "contain" }} src={frontImage} alt="Uploaded" />
                                </div>
                            )}
                        </label>
                        <label style={{ width: "250px" }} htmlFor="front_image">
                            <p>
                                <FaStarOfLife size={8} />
                                Mashinaning orqa rasmi
                            </p>
                            <Upload
                                customRequest={({ file }) => handleUpload(file, setBackImage)}
                                showUploadList={false}
                            >
                                <Button style={{ width: "250px", height: "35px", border: "1px solid #ccc", borderRadius: "0" }}>
                                    <FaUpload /> Rasmni tanlash
                                </Button>
                            </Upload>
                            {backImage && (
                                <div style={{ width: "100%" }}>
                                    <p>Yuklangan rasm:</p>
                                    <img style={{ width: "100%", objectFit: "contain" }} src={backImage} alt="Uploaded" />
                                </div>
                            )}
                        </label>
                        <label style={{ width: "250px" }} htmlFor="front_image">
                            <p>
                                <FaStarOfLife size={8} />
                                Mashinaning o'ng rasmi
                            </p>
                            <Upload
                                customRequest={({ file }) => handleUpload(file, setRightImage)}
                                showUploadList={false}
                            >
                                <Button style={{ width: "250px", height: "35px", border: "1px solid #ccc", borderRadius: "0" }}>
                                    <FaUpload /> Rasmni tanlash
                                </Button>
                            </Upload>
                            {rightImage && (
                                <div style={{ width: "100%" }}>
                                    <p>Yuklangan rasm:</p>
                                    <img style={{ width: "100%", objectFit: "contain" }} src={rightImage} alt="Uploaded" />
                                </div>
                            )}
                        </label>
                        <label style={{ width: "250px" }} htmlFor="front_image">
                            <p>
                                <FaStarOfLife size={8} />
                                Mashinaning chap rasmi
                            </p>
                            <Upload
                                customRequest={({ file }) => handleUpload(file, setLeftImage)}
                                showUploadList={false}
                            >
                                <Button style={{ width: "250px", height: "35px", border: "1px solid #ccc", borderRadius: "0" }}>
                                    <FaUpload /> Rasmni tanlash
                                </Button>
                            </Upload>
                            {leftImage && (
                                <div style={{ width: "100%" }}>
                                    <p>Yuklangan rasm:</p>
                                    <img style={{ width: "100%", objectFit: "contain" }} src={leftImage} alt="Uploaded" />
                                </div>
                            )}
                        </label>
                    </div>
                    <div className="form_part">
                        <p>Servislar</p>
                        {fields.map((item, index) => (
                            <div className='service' key={item.id}>
                                <label>
                                    Servis:
                                    <select
                                        {...register(`services_providing.${index}.service_id`, { required: "Servisni tanlang" })}
                                    >
                                        {services?.map((service) => (
                                            <option key={service._id} value={service._id}>
                                                {service.service_name}
                                            </option>
                                        ))}
                                    </select>

                                    {errors?.services_providing?.[index]?.service_id && (
                                        <span style={{ color: "red" }}>
                                            {errors.services_providing[index].service_id.message}
                                        </span>
                                    )}
                                </label>

                                <label>
                                    Ishchi:
                                    <select
                                        {...register(`services_providing.${index}.user_id`, { required: "Ishchini tanlang" })}
                                    >
                                        {users?.map((user) => (
                                            <option key={user._id} value={user._id}>
                                                {user.name}
                                            </option>
                                        ))}
                                    </select>
                                    {errors?.services_providing?.[index]?.user_id && (
                                        <span style={{ color: "red" }}>
                                            {errors.services_providing[index].user_id.message}
                                        </span>
                                    )}
                                </label>

                                <label>
                                    Servis narxi:
                                    <input
                                        disabled={isFree}
                                        {...register(`services_providing.${index}.amount_to_paid.amount`, {
                                            required: isFree ? false : "Servis narxini kiriting", 
                                        })}
                                        type="number"
                                        onWheel={(e) => {
                                            e.preventDefault();
                                        }}
                                    />
                                    {errors?.services_providing?.[index]?.amount_to_paid?.amount && (
                                        <span style={{ color: "red" }}>
                                            {errors.services_providing[index].amount_to_paid.amount.message}
                                        </span>
                                    )}

                                    <select
                                        disabled={isFree}
                                        {...register(`services_providing.${index}.amount_to_paid.currency`, {
                                            required: "Servis narxining valyutasini kiriting",
                                        })}
                                    >
                                        <option value="UZS">UZS</option>
                                        <option value="USD">USD</option>
                                    </select>
                                    {errors?.services_providing?.[index]?.amount_to_paid?.currency && (
                                        <span style={{ color: "red" }}>
                                            {errors.services_providing[index].amount_to_paid.currency.message}
                                        </span>
                                    )}
                                </label>

                                {/* <label htmlFor="salaryType">
                                    <p>Maosh turi</p>
                                    <select disabled={isFree} onChange={(e) => {
                                        setSalaryType(e.target.value);
                                    }}  {...register(`services_providing.${index}.salaryType`)} id="salaryType">
                                        <option value="salary">Maosh</option>
                                        <option value="percent">Foiz</option>
                                        <option value="percent_with_profit">Foiz + alohida foyda</option>
                                    </select>
                                </label> */}
                                {/* <label>
                                    Ishchining maoshi:
                                    <input disabled={watch("isFree") || watch(`services_providing.${index}.salaryType`) !== "salary"} {...register(`services_providing.${index}.user_salary_amount.amount`)} type="number" onWheel={(e) => {
                                        e.preventDefault();
                                    }} />
                                </label>
                                <label>
                                    Alohida foyda:
                                    <input disabled={isFree || watch(`services_providing.${index}.salaryType`) !== "percent_with_profit"} {...register(`services_providing.${index}.extra_profit.amount`)} type="number" onWheel={(e) => {
                                        e.preventDefault();
                                    }} />
                                    <select disabled={isFree || watch(`services_providing.${index}.salaryType`) !== "percent_with_profit"} {...register(`services_providing.${index}.extra_profit.currency`)}>
                                        <option value="UZS">UZS</option>
                                        <option value="USD">USD</option>
                                    </select>
                                </label> */}
                                <label>
                                    Boshlash sanasi:
                                    <input
                                        {...register(`services_providing.${index}.start_time`, { required: "Boshlash sanasini tanlang" })}
                                        type="date"
                                    />
                                    {errors?.services_providing?.[index]?.start_time && (
                                        <span style={{ color: "red" }}>
                                            {errors.services_providing[index].start_time.message}
                                        </span>
                                    )}
                                </label>

                                <label>
                                    Tugash sanasi:
                                    <input
                                        {...register(`services_providing.${index}.end_time`, { required: "Tugash sanasini kiriting" })}
                                        type="date"
                                    />
                                    {errors?.services_providing?.[index]?.end_time && (
                                        <span style={{ color: "red" }}>
                                            {errors.services_providing[index].end_time.message}
                                        </span>
                                    )}
                                </label>

                                {/* <h4>Harajatlar</h4> */}
                                {/* <SpendingsFieldArray control={control} parentIndex={index} register={register} /> */}
                                <label>
                                    Tartib raqami:
                                    <input disabled {...register(`services_providing.${index}.index`)} type="number" onWheel={(e) => {
                                        e.preventDefault();
                                    }} defaultValue={index + 1} />
                                </label>
                                <button style={{ width: "250px", border: "1px solid red", color: "red", background: "transparent" }} type="button" onClick={() => remove(index)}>Servisni o'chirish</button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() =>
                                append({
                                    user_id: "",
                                    amount_to_paid: { amount: null, currency: "UZS" },
                                    service_id: "",
                                    start_time: "",
                                    end_time: "",
                                    status: "pending",
                                    index: fields.length + 1,
                                })
                            }
                        >
                            Servis qo'shish
                        </button>
                    </div>
                </div>
                <button type="submit">Saqlash</button>
            </form>
        </div>
    );
};


export default AddProject;
// const SpendingsFieldArray = ({ control, parentIndex, register }) => {
//     const { fields, append, remove } = useFieldArray({
//         control,
//         name: `services_providing.${parentIndex}.spendings`,
//     });

//     return (
//         <>
//             {fields.map((item, index) => (
//                 <div className='spending' key={item.id}>
//                     <label>
//                         Harajat miqdori:
//                         <input {...register(`services_providing.${parentIndex}.spendings.${index}.amount.amount`)} type="number" onWheel={(e) => {
//                             e.preventDefault();
//                         }} />
//                         <select {...register(`services_providing.${parentIndex}.spendings.${index}.amount.currency`)}>
//                             <option value="UZS">UZS</option>
//                             <option value="USD">USD</option>
//                         </select>
//                     </label>

//                     <label>
//                         Tavsif:
//                         <input {...register(`services_providing.${parentIndex}.spendings.${index}.description`)} type="text" />
//                     </label>

//                     <button style={{ border: "1px solid red", color: "red", background: "transparent" }} type="button" onClick={() => remove(index)}>Harajatni o'chirish</button>
//                 </div>
//             ))}

//             <button type="button" onClick={() => append({ amount: { amount: null, currency: "UZS" }, description: "" })}>Harajat qo'shish</button>
//         </>
//     );
// };
