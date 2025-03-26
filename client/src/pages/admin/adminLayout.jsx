import React from 'react';
import { useGetProjectsQuery } from '../../context/services/project.service';
import { useGetUsersQuery } from '../../context/services/user.service';
import TotalAmountPaidChart from '../../components/chart/totalAmountPaidChart';
import NetProfitChart from '../../components/chart/netProfitChart';
import income from '../../assets/income.png'
import outgoing from '../../assets/outgoing.png'
import { FaDoorOpen } from "react-icons/fa";

const AdminLayout = () => {
    const { data: projects = [] } = useGetProjectsQuery()
    const { data: users = [] } = useGetUsersQuery()
    console.log(projects);

    return (
        <div className='admin_layout'>
            <b>Umumiy statistika</b>
            <div className="cards">
                <div className="card">
                    <img src={income} alt="" />
                    <b>{Number(projects.filter(p => p.currency === "UZS").reduce((acc, item) => acc + item.total_amount_paid, 0).toFixed()).toLocaleString()} UZS</b>
                    <p>Umumiy kirim(UZS)</p>
                </div>
                <div className="card">
                    <img src={income} alt="" />

                    <b>{projects.filter(p => p.currency === "USD").reduce((acc, item) => acc + item.total_amount_paid, 0).toLocaleString()} USD</b>
                    <p>Umumiy kirim(USD)</p>
                </div>
                <div className="card">
                    <img src={outgoing} alt="" />
                    <b>{Number(projects.filter(p => p.currency === "UZS").reduce((acc, item) => acc + item.total_spending_amount, 0).toFixed()).toLocaleString()} UZS</b>
                    <p>Umumiy xarajat(UZS)</p>
                </div>
                <div className="card">
                    <img src={outgoing} alt="" />
                    <b>{projects.filter(p => p.currency === "USD").reduce((acc, item) => acc + item.total_spending_amount, 0).toLocaleString()} USD</b>
                    <p>Umumiy xarajat(USD)</p>
                </div>
            </div>
            <b>Mashinalarning umumiy to'lovlari(UZS)</b>
            <TotalAmountPaidChart projects={projects.filter(p => p.currency === "UZS").sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))} />
            <b>Mashinalarning umumiy to'lovlari(USD)</b>
            <TotalAmountPaidChart projects={projects.filter(p => p.currency === "USD").sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))} />
            <b>Mashinalarning sof foydasi(UZS)</b>
            <NetProfitChart projects={projects.filter(p => p.currency === "UZS").sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))} />
            <b>Mashinalarning sof foydasi(USD)</b>
            <NetProfitChart projects={projects.filter(p => p.currency === "USD").sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))} />
            <button onClick={() => {
                localStorage.clear();
                window.location.href = "/"
            }}>
                <FaDoorOpen />
            </button>
        </div>
    );
};


export default AdminLayout;