import { useCallback, useMemo, useState } from "react";
import {
  useDeleteProjectMutation,
  useFinishProjectMutation,
  useGetProjectsQuery,
  usePauseServiceMutation,
  usePayProjectMutation,
} from "../../context/services/project.service";
import { RiFilterLine } from "react-icons/ri";
import { BiSearchAlt2 } from "react-icons/bi";
import { message, Modal, Popconfirm, Popover, Table } from "antd";
import { FaCheck, FaDollarSign, FaImage, FaList, FaMinus, FaPause, FaPlay } from "react-icons/fa";
import { useGetServiceQuery } from "../../context/services/service.service";
import moment from "moment";
import { useGetUsersQuery } from "../../context/services/user.service";
import { MdDeleteForever, MdEdit } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const [deleteProject, { isLoading: deleteLoading }] =
    useDeleteProjectMutation();
  const [finishProject, { isLoading: finishLoading }] =
    useFinishProjectMutation();
  const { data: projects = [] } = useGetProjectsQuery();
  const [pauseProject] = usePauseServiceMutation();
  const [imageModal, setImageModal] = useState(false)
  const [imageId, setImageId] = useState("")
  const { data: users = [] } = useGetUsersQuery();
  const { data: services = [] } = useGetServiceQuery();
  const [payProject] = usePayProjectMutation();
  const [open, setOpen] = useState(false);
  const [payingProject, setPayingProject] = useState("");
  const navigate = useNavigate();
  const [filters, setFilters] = useState({
    status: "",
    searchTerm: "",
  });
  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      const matchesStatus = filters.status
        ? item.status === filters.status
        : true;
      const matchesSearchTerm = filters.searchTerm.toLowerCase()
        ? (
          item.car_name.toLowerCase() +
          item.car_number.toLowerCase() +
          item.car_id.toLowerCase() +
          item.client_name.toLowerCase() +
          item.client_phone.toLowerCase()
        ).includes(filters.searchTerm)
        : true;
      return matchesStatus && matchesSearchTerm;
    });
  }, [projects, filters]);



  const handleFilterChange = useCallback((e) => {
    setFilters((prev) => ({ ...prev, status: e.target.value }));
  }, []);

  const status = {
    pending: "Kutilmoqda",
    inprogress: "Jarayonda",
    finished: "Tugatildi",
    approved: "Tasdiqlandi",
    rejected: "Tasdiqlanmadi",
  };

  const projectsColumns = [
    { title: "Mashina nomi", dataIndex: "car_name", key: "car_name" },
    { title: "Mashina raqami", dataIndex: "car_number", key: "car_number" },
    { title: "Mashina ID si", dataIndex: "car_id", key: "car_id" },
    { title: "Klent ismi", dataIndex: "client_name", key: "client_name" },
    { title: "Klent raqami", dataIndex: "client_phone", key: "client_phone" },
    {
      title: "Chiqib ketish sanasi",
      dataIndex: "leave_date",
      key: "_id",
      render: (text) => moment(text).format("DD.MM.YYYY"),
    },
    { title: "Holat", dataIndex: "status", render: (text) => status[text] },
    { title: "Valyuta", dataIndex: "currency", key: "_id" },
    {
      title: "Bepul",
      dataIndex: "isFree",
      render: (text) => text ? "Ha" : "Yo'q"
    },
    {
      title: "Jami xarajat",
      dataIndex: "total_spending_amount",
      key: "_id",
      render: (text) => text?.toLocaleString(),
    },
    {
      title: "Jami to'lov",
      dataIndex: "total_amount_to_paid",
      key: "_id",
      render: (text) => text?.toLocaleString(),
    },
    {
      title: "Qilingan to'lov",
      dataIndex: "total_amount_paid",
      key: "_id",
      render: (text) => text?.toLocaleString(),
    },
    {
      title: "Qolgan to'lov",
      dataIndex: "remained_amount_to_paid",
      key: "_id",
      render: (text) => text?.toLocaleString(),
    },
    {
      title: "Servis",
      render: (_, record) => (
        <div className="table_actions">
          <Popover
            placement="bottom"
            title={"Mashinaning barcha servislari"}
            content={
              <Table
                dataSource={record?.services_providing}
                columns={tooltipColumns}
              />
            }
          >
            <button>
              <FaList />
            </button>
          </Popover>
        </div>
      ),
    },
    {
      title: "Rasmlar",
      render: (_, record) => (
        <div className="table_actions">
          <button onClick={() => {
            setImageModal(true)
            setImageId(record._id)
          }}>
            <FaImage />
          </button>
        </div>
      )
    },
    {
      title: "To'lov",
      render: (_, record) => (
        <div className="table_actions">
          <Popover
            placement="bottom"
            title={"Mashinaning barcha to'lovlari"}
            content={
              <Table
                dataSource={record?.payment_log}
                columns={paymentTooltipColumns}
              />
            }
          >
            <button disabled={record.isFree}>
              <FaList />
            </button>
          </Popover>
        </div>
      ),
    },
    {
      title: "Amallar",
      render: (_, record) => (
        <div className="table_actions">
          <button
            disabled={record.isFree}
            onClick={() => {
              setPayingProject(record._id);
              setOpen(true);
            }}
          >
            <FaDollarSign />
          </button>
          <button onClick={() => navigate(`/addproject/${record._id}`)}>
            <MdEdit />
          </button>
          <Popconfirm
            title="Chindan ham mashinani barcha servislarini tugallanganini tasdiqlaysizmi?"
            okText="Ha"
            description='Bu holatda uning holati "tugatildi" etib belgilanadi'
            cancelText="Yo'q"
            onConfirm={async () => {
              try {
                await finishProject(record._id).unwrap();
                message.success("Mashina tugallandi");
              } catch (error) {
                message.error("Xatolik yuz berdi");
              }
            }}
            onCancel={() => { }}
            overlayStyle={{
              maxWidth: "350px",
              height: "auto",
              minWidth: "auto",
            }}
            okButtonProps={{ loading: finishLoading }}
          >
            <button disabled={record.status === "finished"}>
              <FaCheck />
            </button>
          </Popconfirm>

          <Popconfirm
            title="Chindan ham mashinani o'chirmoqchimisiz?"
            okText="Ha"
            description="Bu holatdan uni qayta tiklab bo'lmaydi va unga bog'langan barcha ishchilarning oylik maoshlari kamayadi(xattoki ularning servislari tasdiqlangan bo'lsa ham)"
            cancelText="Yo'q"
            onConfirm={async () => {
              try {
                await deleteProject(record._id).unwrap();
                message.success("Mashina o'chirildi");
              } catch (error) {
                message.error("Xatolik yuz berdi");
              }
            }}
            onCancel={() => { }}
            overlayStyle={{
              maxWidth: "350px",
              height: "auto",
              minWidth: "auto",
            }}
            okButtonProps={{ loading: deleteLoading }}
          >
            <button style={{ background: "red" }}>
              <MdDeleteForever />
            </button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  const tooltipColumns = [
    {
      title: "Servis",
      dataIndex: "service_id",
      key: "service_id",
      render: (text) => services.find((s) => s._id === text).service_name,
    },
    {
      title: "Ishchi",
      dataIndex: "user_id",
      key: "user_id",
      render: (text) => users.find((u) => u._id === text)?.name || <FaMinus />,
    },
    {
      title: "Servis narxi",
      dataIndex: "amount_to_paid",
      key: "amount_to_paid",
      render: (text) => text.amount?.toLocaleString() + " " + text.currency,
    },
    {
      title: "Maosh turi",
      dataIndex: "salaryType",
      render: (text) => text === "salary" ? "Maosh" : text === "percent" ? "Foiz" : "Nomalum"
    },
    {
      title: "Maosh",
      dataIndex: "user_salary_amount",
      key: "user_salary_amount",
      render: (text) => text.amount?.toLocaleString() + " " + text.currency,
    },
    { title: "Holat", dataIndex: "status", render: (text) => status[text] },
    {
      title: "Boshlash sanasi",
      dataIndex: "start_time",
      key: "start_time",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Tugatish sanasi",
      dataIndex: "end_time",
      key: "end_time",
      render: (text) => moment(text).format("YYYY-MM-DD"),
    },
    {
      title: "Xarajatlar",
      render: (_, record) => (
        <div className="table_actions">
          <Popover
            placement="bottom"
            title={"Servisning barcha xarajatlari"}
            content={
              <Table
                dataSource={record?.spendings}
                columns={spendingsTooltipColumns}
              />
            }
          >
            <button>
              <FaList />
            </button>
          </Popover>
        </div>
      ),
    },
    {
      title: "Pauza",
      render: (_, record) => (
        <div className="table_actions">
          <button
            disabled={filteredProjects.find(project =>
              project.services_providing.some(service => service._id === record._id)).status === "finished"}
            onClick={() => {
              const project = filteredProjects.find(project =>
                project.services_providing.some(service => service._id === record._id)
              );
              pauseProject({
                project_id: project ? project._id : null,
                service_id: record._id,
              });
            }}
          >
            {record.status !== "paused" ? <FaPause /> : <FaPlay />}
          </button>

        </div >
      )
    }
  ];

  const spendingsTooltipColumns = [
    {
      title: "Xarajat summasi",
      dataIndex: "amount",
      key: "amount",
      render: (text) => text.amount?.toLocaleString() + " " + text.currency,
    },
    { title: "Xarajat tavsifi", dataIndex: "description", key: "_id" },
  ];
  const paymentTooltipColumns = [
    {
      title: "To'lov summasi",
      key: "_id",
      render: (_, record) =>
        record.amount?.toLocaleString() + " " + record.currency,
    },
    {
      title: "Sana",
      dataIndex: "paid_date",
      key: "_id",
      render: (text) => moment(text).format("DD.MM.YYYY"),
    },
  ];

  return (
    <div className="manager_page">
      <div className="project_stats">
        <div className="project_stat_card">
          <b>{projects.filter(p => p.status === "inprogress").length} ta</b>
          <p>Jarayondagi mashinalar</p>
        </div>
        <div className="project_stat_card">
          <b>{projects.filter(p => p.status === "finished").length} ta</b>
          <p>Tugallangan mashinalar</p>
        </div>
      </div>
      <Modal style={{ flexGrow: "1" }} height={300} open={imageModal} footer={[]} onCancel={() => {
        setImageModal(false);
        setImageId("");
      }} title="Mashinaning rasmlari">
        <div className="modal_form" style={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
          <img style={{ maxWidth: "300px", maxHeight: "300px", objectFit: "contain", padding: "6px" }} src={projects.find((p) => p._id === imageId)?.front_image} alt="" />
          <img style={{ maxWidth: "300px", maxHeight: "300px", objectFit: "contain", padding: "6px" }} src={projects.find((p) => p._id === imageId)?.back_image} alt="" />
          <img style={{ maxWidth: "300px", maxHeight: "300px", objectFit: "contain", padding: "6px" }} src={projects.find((p) => p._id === imageId)?.right_image} alt="" />
          <img style={{ maxWidth: "300px", maxHeight: "300px", objectFit: "contain", padding: "6px" }} src={projects.find((p) => p._id === imageId)?.left_image} alt="" />
        </div>
      </Modal>
      <Modal
        title="Mashina uchun to'lov"
        footer={[]}
        onCancel={() => {
          setOpen(false);
          setPayingProject("");
        }}
        open={open}
      >
        <form
          autoComplete='off'
          onSubmit={async (e) => {
            e.preventDefault();
            const amount = Number(e.target.amount.value);
            const currency = e.target.currency.value;

            try {
              await payProject({
                body: { amount, currency },
                project_id: payingProject,
              });

              message.success("To'lov qabul qilindi");
              setOpen(false);
              setPayingProject("");
            } catch (error) {
              message.error("Xatolik yuz berdi");
            }
          }}
          className="modal_form"
        >
          <label htmlFor="amount">
            <p>To'lov summasi</p>
            <input name="amount" type="number" id="amount" required />
          </label>
          <label htmlFor="currency">
            <p>To'lov valyutasi</p>
            <select name="currency" id="currency" required>
              <option value="UZS">UZS</option>
              <option value="USD">USD</option>
            </select>
          </label>
          <button>To'lash</button>
        </form>
      </Modal>
      <div className="manager_page_header">
        <p>Mashinalar</p>
        <div className="manager_page_header_actions">
          <select onChange={handleFilterChange}>
            <option value="">Barchasi</option>
            <option value="inprogress">Jarayonda</option>
            <option value="finished">Tugatildi</option>
          </select>
          <RiFilterLine />
          <input
            type="search"
            onChange={(e) => {
              setFilters({ ...filters, searchTerm: e.target.value });
            }}
            placeholder="Mashina raqami, nomi, ID si, klent ismi, tel raqami orqali qidirish"
          />
          <BiSearchAlt2 />
        </div>
      </div>
      <Table size="small" dataSource={filteredProjects} columns={projectsColumns} />
    </div>
  );
};

export default Projects;
