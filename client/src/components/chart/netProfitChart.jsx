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

const NetProfitChart = ({ projects }) => {
    const chartData = {
        labels: projects.map((project) => project.car_name),
        datasets: [
            {
                label: "Sof foyda summasi",
                data: projects.map((project) =>
                    project.services_providing.reduce((total, service) => total + (service.net_profit?.amount || 0), 0)
                ),
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
                    display: false,
                },
            },
            x: {
                ticks: {
                    display: true,
                },
                grid: {
                    display: false,
                },
            },
        },
    };

    return <Line  style={{ border: "1px solid #ccc" }} data={chartData} options={options} />;
};

export default NetProfitChart;