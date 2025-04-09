const { default: axios } = require('axios');
const Project = require('../models/projectModel');
const url = "https://cbu.uz/uz/arkhiv-kursov-valyut/json/";

const getUsdRate = async () => {
    try {
        const response = await axios.get(url);
        return Number(response.data[0].Rate);
    } catch (error) {
        console.error("USD kursini olishda xatolik:", error);
        throw new Error("USD kursini olishda muammo yuz berdi");
    }
};

exports.getProject = async (req, res) => {
    try {
        const { admin_id } = req.user
        const projects = await Project.find({ admin_id });
        res.json(projects);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

// exports.createProject = async (req, res) => {
//     try {
//         const { admin_id } = req.user;
//         req.body.admin_id = admin_id;
//         const { currency } = req.body;

//         const usdRate = await getUsdRate();
//         let totalAmountToPaid = 0;
//         let totalSpendingAmount = 0;
//         let totalExtraProfit = 0;

//         req.body.services_providing.forEach(service => {
//             if (service.amount_to_paid.currency === "USD") {
//                 totalAmountToPaid += currency === "USD"
//                     ? service.amount_to_paid.amount
//                     : service.amount_to_paid.amount * usdRate;
//             } else {
//                 totalAmountToPaid += currency === "UZS"
//                     ? service.amount_to_paid.amount
//                     : service.amount_to_paid.amount / usdRate;
//             }

//             if (service.extra_profit.currency === "USD") {
//                 totalExtraProfit += currency === "USD"
//                     ? service.extra_profit.amount
//                     : service.extra_profit.amount * usdRate;
//             } else {
//                 totalExtraProfit += currency === "UZS"
//                     ? service.extra_profit.amount
//                     : service.extra_profit.amount / usdRate;
//             }
//         });

//         req.body.services_providing.forEach(service => {
//             service.spendings.forEach(spending => {
//                 if (spending.amount.currency === "USD") {
//                     totalSpendingAmount += currency === "USD"
//                         ? spending.amount.amount
//                         : spending.amount.amount * usdRate;
//                 } else {
//                     totalSpendingAmount += currency === "UZS"
//                         ? spending.amount.amount
//                         : spending.amount.amount / usdRate;
//                 }
//             });
//         });

//         req.body.services_providing = req.body.services_providing.map(service => {
//             let totalSpendingAmountForService = service.spendings.reduce((acc, spending) => {
//                 let spendingAmount = spending.amount.currency === "USD"
//                     ? (currency === "USD" ? spending.amount.amount : spending.amount.amount * usdRate)
//                     : (currency === "UZS" ? spending.amount.amount : spending.amount.amount / usdRate);
//                 return acc + spendingAmount;
//             }, 0);

//             let serviceAmountToPaid = service.amount_to_paid.currency === "USD"
//                 ? (currency === "USD" ? service.amount_to_paid.amount : service.amount_to_paid.amount * usdRate)
//                 : (currency === "UZS" ? service.amount_to_paid.amount : service.amount_to_paid.amount / usdRate);

//             let extraProfitConverted = service.extra_profit.currency === "USD"
//                 ? (currency === "USD" ? service.extra_profit.amount : service.extra_profit.amount * usdRate)
//                 : (currency === "UZS" ? service.extra_profit.amount : service.extra_profit.amount / usdRate);

//             if (service.salaryType === "percent" || service.salaryType === "percent_with_profit") {
//                 let netProfitBase = (serviceAmountToPaid - totalSpendingAmountForService - extraProfitConverted) * 0.2 + extraProfitConverted;
//                 service.user_salary_amount = {
//                     amount: Math.round(((serviceAmountToPaid - totalSpendingAmountForService - extraProfitConverted) * 0.8) * (currency === "USD" ? usdRate : 1) * 100) / 100,
//                     currency: "UZS"
//                 };

//                 if (service.salaryType === "percent_with_profit") {
//                     service.net_profit = {
//                         amount: Math.round(netProfitBase * 100) / 100,
//                         currency: currency
//                     };
//                 }
//             } else if (service.salaryType === "salary") {
//                 let netProfit = serviceAmountToPaid - totalSpendingAmountForService - service.user_salary_amount.amount;
//                 service.net_profit = {
//                     amount: Math.round(netProfit * 100) / 100,
//                     currency: currency
//                 };
//             }

//             return {
//                 ...service,
//                 user_salary_amount: service.user_salary_amount,
//                 net_profit: service.net_profit || {
//                     amount: Math.round(((totalAmountToPaid - totalSpendingAmount) * 0.2 + totalExtraProfit) * 100) / 100,
//                     currency: currency
//                 }
//             };
//         });

//         req.body.total_amount_to_paid = Math.round(totalAmountToPaid * 100) / 100;
//         req.body.total_spending_amount = Math.round(totalSpendingAmount * 100) / 100;
//         req.body.remained_amount_to_paid = Math.round(totalAmountToPaid * 100) / 100;

//         const project = new Project(req.body);
//         await project.save();

//         res.json(project);
//     } catch (err) {
//         console.error(err.message);
//         return res.status(500).json({ message: "Serverda xatolik" });
//     }
// };

exports.createProject = async (req, res) => {
    try {
        const { total_profit, services_providing, currency } = req.body;
        const { admin_id } = req.user;
        req.body.admin_id = admin_id;
        const usdRate = await getUsdRate();

        services_providing.forEach(service => {
            let servicePrice;

            if (currency === "USD") {
                servicePrice = service.amount_to_paid.currency === "USD"
                    ? service.amount_to_paid.amount
                    : service.amount_to_paid.currency === "UZS"
                        ? service.amount_to_paid.amount / usdRate
                        : 0;
            } else if (currency === "UZS") {
                servicePrice = service.amount_to_paid.currency === "UZS"
                    ? service.amount_to_paid.amount
                    : service.amount_to_paid.currency === "USD"
                        ? service.amount_to_paid.amount * usdRate
                        : 0;
            }

            service.net_profit = {
                amount: servicePrice * 0.2,
                currency
            };

            service.user_salary_amount = {
                amount: currency === "USD"
                    ? servicePrice * 0.8 * usdRate
                    : servicePrice * 0.8,
                currency: "UZS"
            };
        });

        const totalSalaries = services_providing.reduce((acc, service) => acc + service.user_salary_amount.amount, 0);
        const totalNetProfit = services_providing.reduce((acc, service) => acc + service.net_profit.amount, 0);

        let netProfit;

        if (currency === "UZS") {
            netProfit = total_profit - totalSalaries;
        } else if (currency === "USD") {
            netProfit = total_profit - (totalSalaries / usdRate + totalNetProfit);
        }
        req.body.total_amount_to_paid = total_profit
        req.body.remained_amount_to_paid = total_profit
        req.body.net_profit = netProfit;

        const newProject = new Project(req.body);
        await newProject.save();

        res.json({ message: "Project qo'shildi" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Serverda xatolik" });
    }
};


// exports.updateProject = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const editingProject = await Project.findById(id);
//         if (!editingProject) {
//             return res.status(404).json({ message: "Loyiha topilmadi" });
//         }

//         const { total_profit, services_providing, currency } = req.body;
//         const usdRate = await getUsdRate();

//         services_providing.forEach(service => {
//             let servicePrice;

//             if (currency === "USD") {
//                 servicePrice = service.amount_to_paid.currency === "USD"
//                     ? service.amount_to_paid.amount
//                     : service.amount_to_paid.currency === "UZS"
//                         ? service.amount_to_paid.amount / usdRate
//                         : 0;
//             } else if (currency === "UZS") {
//                 servicePrice = service.amount_to_paid.currency === "UZS"
//                     ? service.amount_to_paid.amount
//                     : service.amount_to_paid.currency === "USD"
//                         ? service.amount_to_paid.amount * usdRate
//                         : 0;
//             }

//             service.net_profit = {
//                 amount: servicePrice * 0.2,
//                 currency
//             };

//             service.user_salary_amount = {
//                 amount: currency === "USD"
//                     ? servicePrice * 0.8 * usdRate
//                     : servicePrice * 0.8,
//                 currency: "UZS"
//             };
//         });

//         const totalSalaries = services_providing.reduce((acc, service) => acc + service.user_salary_amount.amount, 0);
//         const totalNetProfit = services_providing.reduce((acc, service) => acc + service.net_profit.amount, 0);
//         // const totalAmountToPaid = services_providing.reduce((acc, service) => acc + service.amount_to_paid.amount, 0)

//         let netProfit;

//         if (currency === "UZS") {
//             netProfit = total_profit - totalSalaries;
//         } else if (currency === "USD") {
//             netProfit = total_profit - (totalSalaries / usdRate + totalNetProfit);
//         }

//         req.body.total_amount_to_paid = total_profit
//         req.body.remained_amount_to_paid = total_profit
//         req.body.net_profit = netProfit;
//         req.body.services_providing = services_providing;

//         const updatedProject = await Project.findByIdAndUpdate(id, req.body, { new: true });

//         res.json({ message: "Loyiha muvaffaqiyatli yangilandi", project: updatedProject });
//     } catch (err) {
//         console.error(err.message);
//         return res.status(500).json({ message: "Serverda xatolik" });
//     }
// };

exports.updateProject = async (req, res) => {
    try {
        const { total_profit, services_providing, currency } = req.body;
        const { id } = req.params; 
        const { admin_id } = req.user;
        req.body.admin_id = admin_id;
        const usdRate = await getUsdRate();

        const project = await Project.findById(id);
        if (!project) {
            return res.status(404).json({ message: "Loyiha topilmadi" });
        }

        services_providing.forEach(service => {
            let servicePrice;

            if (currency === "USD") {
                servicePrice = service.amount_to_paid.currency === "USD"
                    ? service.amount_to_paid.amount
                    : service.amount_to_paid.currency === "UZS"
                        ? service.amount_to_paid.amount / usdRate
                        : 0;
            } else if (currency === "UZS") {
                servicePrice = service.amount_to_paid.currency === "UZS"
                    ? service.amount_to_paid.amount
                    : service.amount_to_paid.currency === "USD"
                        ? service.amount_to_paid.amount * usdRate
                        : 0;
            }

            service.net_profit = {
                amount: servicePrice * 0.2,
                currency
            };

            service.user_salary_amount = {
                amount: currency === "USD"
                    ? servicePrice * 0.8 * usdRate
                    : servicePrice * 0.8,
                currency: "UZS"
            };
        });

        const totalSalaries = services_providing.reduce((acc, service) => acc + service.user_salary_amount.amount, 0);
        const totalNetProfit = services_providing.reduce((acc, service) => acc + service.net_profit.amount, 0);

        let netProfit;

        if (currency === "UZS") {
            netProfit = total_profit - totalSalaries;
        } else if (currency === "USD") {
            netProfit = total_profit - (totalSalaries / usdRate + totalNetProfit);
        }

        req.body.total_amount_to_paid = total_profit;
        req.body.remained_amount_to_paid = total_profit;
        req.body.net_profit = netProfit;

        Object.assign(project, req.body);
        await project.save();

        res.json({ message: "Loyiha yangilandi" });
    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Serverda xatolik" });
    }
};



exports.deleteProject = async (req, res) => {
    try {
        const { id } = req.params;
        await Project.findByIdAndDelete(id);
        res.json({ message: "Mashina o'chirildi" });

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}


exports.createPayment = async (req, res) => {
    try {
        const { project_id } = req.params;
        const { amount, currency } = req.body
        const usdRate = await getUsdRate();

        const project = await Project.findById(project_id);
        const paymentAmount = project?.currency === "USD"
            ? (currency === "USD" ? amount : amount / usdRate)
            : (currency === "UZS" ? amount : amount * usdRate);

        if (project) {
            project.payment_log.push({
                amount: paymentAmount,
                currency: currency,
                paid_date: new Date().toISOString()
            });
            project.total_amount_paid += paymentAmount;
            project.remained_amount_to_paid = Math.round((project.total_amount_to_paid - project.total_amount_paid) * 100) / 100;
            await project.save();
        }


        res.json({ message: "To'lov qayd etildi" });
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.finishProject = async (req, res) => {
    try {
        const { project_id } = req.params;

        let project = await Project.findById(project_id);
        if (!project) {
            return res.status(404).json({ message: "Loyiha topilmadi" });
        }

        project.services_providing = project.services_providing.map(service => {
            if (service.status !== 'approved') {
                return {
                    ...service,
                    status: 'approved',
                    approved_time: new Date().toISOString()
                };
            }
            return service;
        });

        project.status = 'finished';
        await project.save();

        res.json({ message: "Mashina servisi to'liq tugatildi" });

    } catch (err) {
        console.log(err.message);
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.getProjectByUser = async (req, res) => {
    try {
        const { user_id } = req.params;

        if (!user_id) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        const projects = await Project.find({
            'services_providing.user_id': user_id
        });

        const categorizedProjects = {
            pending_projects: [],
            inprogress_projects: [],
            finished_projects: [],
            approved_projects: [],
            rejected_projects: []
        };

        projects.forEach(project => {
            project.services_providing.forEach(service => {
                if (service.user_id.toString() === user_id) {
                    switch (service.status) {
                        case 'pending':
                            categorizedProjects.pending_projects.push(project._id);
                            break;
                        case 'inprogress':
                            categorizedProjects.inprogress_projects.push(project._id);
                            break;
                        case 'finished':
                            categorizedProjects.finished_projects.push(project._id);
                            break;
                        case 'approved':
                            categorizedProjects.approved_projects.push(project._id);
                            break;
                        case 'rejected':
                            categorizedProjects.rejected_projects.push(project._id);
                            break;
                    }
                }
            });
        });

        res.status(200).json(categorizedProjects);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.getAllProjectByUser = async (req, res) => {
    try {
        const { user_id } = req.params;
        const projects = await Project.find({
            'services_providing.user_id': user_id
        });
        res.json(projects);
    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.pauseToggle = async (req, res) => {
    try {
        const { project_id, service_id } = req.params
        const project = await Project.findById(project_id);
        const service = project.services_providing.find(s => s._id.toString() === service_id)
        const isPaused = service.status === 'paused'
        if (!isPaused) {
            service.status = 'paused'
            service.pause_log.push({
                start: new Date().toISOString(),
                end: null
            })
        } else {
            service.status = 'inprogress'
            service.pause_log.at(-1).end = new Date().toISOString()
        }
        await project.save()
        res.json({ message: "Saqlandi" });

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}

exports.createSpending = async (req, res) => {
    try {
        const { amount, description } = req.body
        const { project_id } = req.params
        const project = await Project.findById(project_id)

        if (!project.spendings) {
            project.spendings = [];
        }

        project.spendings.push({
            amount,
            description
        })
        project.net_profit -= amount

        await project.save()
        return res.json({ message: "Xarajat qo'shildi" })

    } catch (err) {
        console.log(err.message)
        return res.status(500).json({ message: "Serverda xatolik" });
    }
}
