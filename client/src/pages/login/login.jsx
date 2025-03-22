import React from 'react';
import { useLoginMutation } from '../../context/services/auth.service';
import { useForm } from 'react-hook-form';
import { message } from 'antd';

const Login = () => {
    const [loginMutation] = useLoginMutation()
    const { register, handleSubmit, reset, formState: { errors } } = useForm()

    async function handleLogin(data) {
        try {
            const res = await loginMutation(data).unwrap();
            message.success(res.message);
            await localStorage.setItem('access_token', res.token);
            await localStorage.setItem('role', res.role);
            await localStorage.setItem('name', res.name);
            await localStorage.setItem('user_id', res.user_id);
            window.location.href = '/'
        } catch (err) {
            console.log(err);
            message.error(err?.data?.message || "Xatolik yuz berdi!");
        }
    }

    return (
        <div className='auth_page'>
            <form onSubmit={handleSubmit(handleLogin)} className="auth_form" autoComplete='off'>
                <p>Xush kelibsiz!<br /> Iltimos hisobingizga kiring</p>
                <input {...register("login", { required: "Login kiriting!" })} type="text" placeholder='Login' />
                {errors.login && <span style={{ fontSize: "18px" }} className='error'>{errors.login.message}</span>}
                <input {...register("password", { required: "Parol kiriting!" })} type="password" placeholder='Parol' />
                {errors.password && <span style={{ fontSize: "18px" }} className='error'>{errors.password.message}</span>}

                <button>Kirish</button>
            </form>
        </div>
    );
};


export default Login;