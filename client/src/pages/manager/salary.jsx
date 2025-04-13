import React, { useState, useEffect } from "react";
import { useGetUsersQuery } from "../../context/services/user.service";
import {
  useCreateSalaryMutation,
  useDeleteSalaryMutation,
  useLazyGetApprovedProjectsQuery,
  useUpdateSalaryMutation,
} from "../../context/services/salary.service";
import moment from "moment";
import { message, Modal, Popover, Table } from "antd";
import { FaDollarSign, FaList } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { useGetProjectsQuery } from "../../context/services/project.service";
import { useGetServiceQuery } from "../../context/services/service.service";

const Salary = () => {
  const [filters, setFilters] = useState({
    month: moment().format("YYYY-MM"),
    searchTerm: "",
  });
  const [createSalary] = useCreateSalaryMutation();
  const [editSalary] = useUpdateSalaryMutation();
  const [deleteSalary] = useDeleteSalaryMutation();
  const [selectedUser, setSelectedUser] = useState("");
  const [editingUser, setEditingUser] = useState("");
  const [editingSalary, setEditingSalary] = useState("");
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [totalSalaries, setTotalSalaries] = useState({});
  const [fetchApprovedProjects] = useLazyGetApprovedProjectsQuery();
  const { data: projects = [] } = useGetProjectsQuery()
  const { data: services = [] } = useGetServiceQuery()
  const { data: users = [] } = useGetUsersQuery();
  async function onSubmit(data) {
    try {
      if (editingUser) {
        await editSalary({
          body: {
            amount: Number(data.amount),
            paycheck_date: data.paycheck_date,
          },
          user_id: editingUser,
          salary_id: editingSalary,
        });
      } else {
        await createSalary({
          body: {
            amount: Number(data.amount),
            paycheck_date: data.paycheck_date,
          },
          user_id: selectedUser,
        });
      }
      setSelectedUser("");
      setEditingSalary("");
      setEditingUser("");
      reset({
        amount: null,
        paycheck_date: moment().format("YYYY-MM-DD"),
      });
      setOpen(false);
      message.success("Maosh berildi");
    } catch (error) {
      console.error(error);
      message.error("Maosh berishda xatolik yuz berdi");
    }
  }


  const calculatePenalties = (user) => {
    if (user.isSpecial) {
      return 0;
    }

    const workHours = moment(user.end_time, "HH:mm").diff(
      moment(user.start_time, "HH:mm"),
      "hours"
    );

    let totalPenalty = 0;
    let lateOrAbsentCount = 0;

    const today = moment().format("YYYY-MM-DD");
    const daysInMonth = moment(filters.month).daysInMonth();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = moment(filters.month).date(day).format("YYYY-MM-DD");

      if (date >= today) continue;
      if (moment(user.createdAt).isAfter(date, "day")) continue;

      const wasPresent = user.attendance.some((att) =>
        moment(att?.arrive_time).isSame(date, "day")
      );
      const isWeekend = user.weekends.some((weekend) =>
        moment(weekend).isSame(date, "day")
      );

      if (!wasPresent && !isWeekend) {
        const rate = lateOrAbsentCount < 3 ? 10000 : 20000;
        totalPenalty += workHours * rate;
        lateOrAbsentCount++;
      }

      const delay = user.delays.find((d) =>
        moment(d.delay_date).isSame(date, "day")
      );

      if (delay) {
        const rate = lateOrAbsentCount < 3 ? 10000 : 20000;
        totalPenalty += (delay.delay_minutes / 60) * rate;
        lateOrAbsentCount++;
      }
    }

    const finalPenalty = totalPenalty - 240000
    if (finalPenalty <= 0) {
      return 0;
    }
    return finalPenalty;
  };


  useEffect(() => {
    const calculateSalaries = async () => {
      const salaries = {};
      for (const user of users) {
        try {
          const { data: allProjects = [] } = await fetchApprovedProjects(
            user._id
          );
          const filteredProjects = allProjects?.filter((p) =>
            filters.month
              ? moment(p.approved_time).format("YYYY-MM") === filters.month
              : true
          );
          const totalSalary = filteredProjects.reduce(
            (acc, curr) =>
              acc +
              curr.services_providing
                .filter(
                  (c) =>
                    (c.user_id === user._id)
                )
                .reduce((a, b) => a + b.user_salary_amount.amount, 0),
            0
          );

          salaries[user._id] = totalSalary;
        } catch (err) {
          console.error("Error fetching salaries:", err);
        }
      }
      setTotalSalaries(salaries);
    };
    if (users.length > 0) {
      calculateSalaries();
    }
  }, [users, filters.month, fetchApprovedProjects]);

  const columns = [
    { title: "Ishchi", dataIndex: "name", key: "_id" },
    {
      title: "Hisoblangan oylik",
      render: (_, record) => {
        const totalSalary = totalSalaries[record._id] || 0;
        const roundedSalary = Math.round(totalSalary / 1000) * 1000; // Yuzliklar va o'nliklarni 0 qilish
        return roundedSalary.toLocaleString() + " UZS";
      }
    },
    {
      title: "Berilgan oylik",
      render: (_, record) =>
        record?.paychecks
          .filter((p) =>
            filters.month
              ? moment(p.paycheck_date).format("YYYY-MM") === filters.month
              : true
          )
          .reduce((acc, p) => acc + p.amount, 0)
          ?.toLocaleString() + " UZS" || 0,
    },
    {
      title: "Davomat jarimalari",
      render: (_, record) => {
        if (record.isSpecial) {
          return (<span >{"0 UZS"}</span>);
        };
        const penalties = [];

        const today = moment().format("YYYY-MM-DD");
        const daysInMonth = moment(filters.month).daysInMonth();

        let lateOrAbsentCount = 0;

        for (let day = 1; day <= daysInMonth; day++) {
          const date = moment(filters.month).date(day).format("YYYY-MM-DD");

          if (date >= today) continue;
          if (moment(record.createdAt).isAfter(date, "day")) continue;

          const attendance = record.attendance.find((att) =>
            moment(att?.arrive_time).isSame(date, "day")
          );
          const delay = record.delays.find((del) =>
            moment(del.delay_date).isSame(date, "day")
          );
          const isWeekend = record.weekends.some((weekend) =>
            moment(weekend).isSame(date, "day")
          );

          if (!attendance && !isWeekend) {
            const workHours = moment(record.end_time, "HH:mm").diff(
              moment(record.start_time, "HH:mm"),
              "hours"
            );

            const fineAmount = lateOrAbsentCount < 3
              ? workHours * 10000
              : workHours * 20000;

            penalties.push({
              date,
              arrive_time: "-",
              leave_time: "-",
              delay_hours: "Ha",
              fine: fineAmount,
            });

            lateOrAbsentCount++;
          }

          if (delay) {
            const fineAmount = lateOrAbsentCount < 3
              ? (delay.delay_minutes / 60) * 10000
              : (delay.delay_minutes / 60) * 20000;

            penalties.push({
              date,
              arrive_time: attendance?.arrive_time ? moment(attendance?.arrive_time).format("HH:mm") : "-",
              leave_time: attendance?.leave_time ? moment(attendance?.leave_time).format("HH:mm") : "-",
              delay_hours: (delay.delay_minutes / 60).toFixed(2) + " soat",
              fine: fineAmount,
            });

            lateOrAbsentCount++;
          }
        }

        return (
          <Popover
            placement="bottom"
            title="Jarimalar tafsiloti"
            content={
              <Table
                dataSource={penalties}
                pagination={{ pageSize: 8 }}
                columns={[
                  { title: "Sana", dataIndex: "date", key: "date" },
                  { title: "Kelgan vaqti", dataIndex: "arrive_time", key: "arrive_time" },
                  { title: "Ketgan vaqti", dataIndex: "leave_time", key: "leave_time" },
                  { title: "Kech qolgan", dataIndex: "delay_hours", key: "delay_hours" },
                  { title: "Jarima summasi", dataIndex: "fine", key: "fine", render: (text) => Number(text.toFixed()).toLocaleString() + " UZS" },
                ]}
              />
            }
          >
            <span>
              {Number((penalties.reduce((acc, p) => acc + p.fine, 0) - 240000).toFixed()) < 0 ? 0 + " UZS" : Number((penalties.reduce((acc, p) => acc + p.fine, 0) - 240000).toFixed()).toLocaleString() + " UZS"}
            </span>
          </Popover>
        );
      },
    },
    {
      title: "Sanaga kech qolishlar",
      render: (_, record) => {
        const filteredServiceDelays = record.service_delays.filter(d => moment(d.delay_date).format("YYYY-MM") === filters.month)
        return (
          <Popover trigger="click" title="Sanaga kech qolishlar" placement="bottom" content={
            <Table columns={[
              {
                title: "Mashina",
                dataIndex: "project_id",
                render: (text) => projects.find(p => p._id === text)?.car_name + " - " + projects.find(p => p._id === text)?.car_number
              },
              {
                title: "Servis",
                render: (_, record) => services.find(s => s._id === projects.find(p => p._id === record.project_id)?.services_providing.find(p => p._id === record.service_id)?.service_id)?.service_name
              },
              {
                title: "Kech qolish kunlari",
                dataIndex: "delay_days"
              },
              {
                title: "Jarima summasi",
                dataIndex: "delay_days",
                render: (text) => (text * 100000).toLocaleString() + " UZS"
              }
            ]} dataSource={filteredServiceDelays} />
          }>
            <span>{filteredServiceDelays.reduce((acc, d) => acc + d.delay_days * 100000, 0).toLocaleString() + " UZS"}</span>
          </Popover>
        )
      },
      key: "_id"
    },
    {
      title: "Qolgan oylik",
      render: (_, record) => {
        const total = totalSalaries[record._id] || 0;
        const penalties = calculatePenalties(record) || 0;
    
        const paid = (record?.paychecks || [])
          .filter(p =>
            filters.month
              ? moment(p.paycheck_date).format("YYYY-MM") === filters.month
              : true
          )
          .reduce((acc, p) => acc + p.amount, 0);
    
        const remaining = Math.round((total - penalties - paid) / 1000) * 1000;
    
        return (remaining || 0).toLocaleString() + " UZS";
      }
    },
    {
      title: "Amallar",
      render: (_, record) => (
        <div className="table_actions">
          <Popover
            placement="bottom"
            title={"Berilgan oyliklar"}
            content={
              <Table
                dataSource={record?.paychecks.filter((p) =>
                  filters.month
                    ? moment(p.paycheck_date).format("YYYY-MM") ===
                    filters.month
                    : true
                )}
                columns={[
                  {
                    title: "Summa",
                    dataIndex: "amount",
                    key: "_id",
                    render: (text) => text.toLocaleString() + " UZS",
                  },
                  {
                    title: "Sanasi",
                    dataIndex: "paycheck_date",
                    key: "_id",
                    render: (text) => moment(text).format("DD.MM.YYYY"),
                  },
                  {
                    title: "Amallar",
                    render: (_, salaryRecord) => (
                      <div className="table_actions">
                        <button
                          onClick={() => {
                            setEditingSalary(salaryRecord._id);
                            setEditingUser(record._id);
                            reset({
                              amount: salaryRecord.amount,
                              paycheck_date: moment(
                                salaryRecord.paycheck_date
                              ).format("YYYY-MM-DD"),
                            });
                            setOpen(true);
                          }}
                        >
                          <MdEdit />
                        </button>
                        <button
                          onClick={() => {
                            deleteSalary({
                              user_id: record._id,
                              salary_id: salaryRecord._id,
                            });
                          }}
                        >
                          <MdDeleteForever />
                        </button>
                      </div>
                    ),
                  },
                ]}
              />
            }
          >
            <button>
              <FaList />
            </button>
          </Popover>
          <button
            onClick={() => {
              setSelectedUser(record._id);
              setOpen(true);
            }}
          >
            <FaDollarSign />
          </button>
        </div>
      ),
    },
  ];




  return (
    <div className="manager_page">
      <Modal
        open={open}
        footer={[]}
        title="Maosh berilganligi qayd etish"
        onCancel={() => {
          setSelectedUser("");
          setOpen(false);
        }}
      >
        <form autoComplete='off' onSubmit={handleSubmit(onSubmit)} className="modal_form">
          <label htmlFor="amount">
            <p>Maosh summasi(UZS)</p>
            <input
              {...register("amount", { required: "Summani kiriting" })}
              type="number"
              id="amount"
            />
          </label>
          <label htmlFor="paycheck_date">
            <p>Sana</p>
            <input
              type="date"
              {...register("paycheck_date", { required: "Sanani tanlang" })}
              id="paycheck_date"
              defaultValue={moment().format("YYYY-MM-DD")}
            />
          </label>
          <button>Saqlash</button>
        </form>
      </Modal>
      <div className="manager_page_header">
        <p>Ishchilarning oyligini hisoblash</p>
        <div className="manager_page_header_actions">
          <input
            value={filters.month}
            type="month"
            onChange={(e) => setFilters({ ...filters, month: e.target.value })}
          />
          <input
            type="search"
            onChange={(e) =>
              setFilters({ ...filters, searchTerm: e.target.value })
            }
            placeholder="Ishchining ismi orqali qidirish"
          />
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={users.map((user) => ({ ...user, key: user._id }))}
      />
    </div>
  );
};

export default Salary;
