import React from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const TotalAmountPaidChart = ({ projects }) => {
    const chartData = {
        labels: projects.map((project) => project.car_name),
        datasets: [
            {
                label: "Umumiy to'lov summasi",
                data: projects.map((project) => project.total_amount_paid),
                borderColor: "#1677FF",
                backgroundColor: "#1677FF",
                borderWidth: 2,
                pointRadius: 5,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
        },
        scales: {
            y: {
                ticks: {
                    display: false,
                },
                grid: {
                    display: true,
                },
            },
            x: {
                ticks: {
                    display: true,
                },
                grid: {
                    display: true,
                },
            },
        },
    };



    return <Line style={{ border: "1px solid #ccc" }} data={chartData} options={options} />;
};

export default TotalAmountPaidChart;
