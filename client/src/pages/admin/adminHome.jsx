import React, { useState } from 'react';
import { useGetProjectsQuery } from '../../context/services/project.service';
// import { useGetUsersQuery } from '../../context/services/user.service';
import TotalAmountPaidChart from '../../components/chart/totalAmountPaidChart';
import NetProfitChart from '../../components/chart/netProfitChart';
import income from '../../assets/income.png'
// import outgoing from '../../assets/outgoing.png'
import { FaDoorOpen } from "react-icons/fa";

const AdminHome = () => {
        const { data: projects = [] } = useGetProjectsQuery()
        // const { data: users = [] } = useGetUsersQuery()
        const [selectedCurrency, setSelectedCurrency] = useState("USD")
    return (
        <div className='admin_page'>
            <b>Umumiy statistika</b>
            <div className="cards">
                <div className="card">
                    <img src={income} alt="" />
                    <b>{Number(projects.filter(p => p.currency === selectedCurrency).reduce((acc, item) => acc + item.total_amount_paid, 0).toFixed()).toLocaleString()} {selectedCurrency}</b>
                    <p>Umumiy kirim({selectedCurrency})</p>
                </div>
                <div className="card">
                    <img src={income} alt="" />
                    <b>{Number(projects.filter(p => p.currency === selectedCurrency).reduce((acc, item) => acc + item.net_profit, 0).toFixed()).toLocaleString()} {selectedCurrency}</b>
                    <p>Sof foyda({selectedCurrency})</p>
                </div>
                {/* <div className="card">
                    <img src={income} alt="" />

                    <b>{projects.filter(p => p.currency === "USD").reduce((acc, item) => acc + item.total_amount_paid, 0).toLocaleString()} USD</b>
                    <p>Umumiy kirim(USD)</p>
                </div> */}
                {/* <div className="card">
                    <img src={outgoing} alt="" />
                    <b>{Number(projects.filter(p => p.currency === selectedCurrency).reduce((acc, item) => acc + item.total_spending_amount, 0).toFixed()).toLocaleString()} {selectedCurrency}</b>
                    <p>Umumiy xarajat({selectedCurrency})</p>
                </div> */}
                {/* <div className="card">
                    <img src={outgoing} alt="" />
                    <b>{projects.filter(p => p.currency === "USD").reduce((acc, item) => acc + item.total_spending_amount, 0).toLocaleString()} USD</b>
                    <p>Umumiy xarajat(USD)</p>
                </div> */}
            </div>
            <select style={{ padding: "12px", border: "1px solid #ccc", alignSelf: "start", display: "flex" }} value={selectedCurrency} onChange={(e) => setSelectedCurrency(e.target.value)}>
                <option value="UZS">UZS</option>
                <option value="USD">USD</option>
            </select>
            <b>Mashinalarning umumiy to'lovlari</b>
            <TotalAmountPaidChart projects={projects.filter(p => p.currency === selectedCurrency).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))} />
            {/* <b>Mashinalarning umumiy to'lovlari(USD)</b>
            <TotalAmountPaidChart projects={projects.filter(p => p.currency === selectedCurrency).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))} /> */}
            <b>Mashinalarning sof foydasi</b>
            <NetProfitChart projects={projects.filter(p => p.currency === selectedCurrency).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))} />
            {/* <b>Mashinalarning sof foydasi(USD)</b>
            <NetProfitChart projects={projects.filter(p => p.currency === selectedCurrency).sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))} /> */}

            {/* <button onClick={() => {
                localStorage.clear();
                window.location.href = "/"
            }}>
                <FaDoorOpen />
            </button> */}
        </div>
    );
};


export default AdminHome;