import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  Button,
  message,
  Space,
  Badge,
  Avatar,
  Modal,

} from "antd";
import { LogoutOutlined, MailOutlined } from "@ant-design/icons";
import { logout } from "../../pages/home/home";
import theme from "../../theme";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";

const { Header } = Layout;
const { Title, Text } = Typography;

interface User {
  user_id: number;
  user_name: string;
  user_role: string;
}

interface Workload {
  id: number;
  department: string;
  assignee: string;
  status: "pending" | "not_completed" | "completed";
  dateTimeStart: string;
  dateTimeEnd: string;
  dateTimeNow: string;
  options: any;
}

const DeanHeader: React.FC = () => {
  const [profile, setProfile] = useState<User | undefined>();
  const [isMailHovered, setIsMailHovered] = useState(false);
  const navigate = useNavigate();
  const [workloads, setWorkloads] = useState<Workload[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get("/user/profile");
      setProfile(response.data);
    } catch (error: any) {
      console.error("Error fetching users:", error);
      if (error.response?.status === 401) {
        message.error("กรุณาเข้าสู่ระบบใหม่");
        navigate("/");
      } else {
        message.error("ไม่สามารถดึงข้อมูลผู้ใช้ได้");
      }
    }
  };

  const fetchWorkloads = async () => {
    try {
      const response = await axiosInstance.get(`/work/user`);
      setWorkloads(response.data);
    } catch (error) {
      console.error("Error fetching workloads:", error);
      message.error("ไม่สามารถดึงข้อมูลภาระงานได้");
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchWorkloads();
  }, []);



  const notCompletedWorkloads = workloads.filter(
    (workload) => workload.status === "not_completed"
  );



  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        // background: theme.headerBg,
        background: "#fff",
        padding: `0 ${theme.spacing.xl}`,
        boxShadow: theme.shadowLarge,
        position: "sticky",
        top: 0,
        zIndex: theme.zIndex.header,
        height: "70px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          src="/up-logo.jpg"
          alt="Logo"
          style={{
            height: "45px",
            width: "45px",
            marginRight: theme.spacing.lg,
            borderRadius: "50%",
            objectFit: "cover",
          }}
        />
        <Title
          level={4}
          style={{
            margin: 0,
            color: "#000",
            fontWeight: theme.fontWeight.semibold,
          }}
        >
          Support Staff Workload - System ICT
        </Title>
      </div>
      <div
        style={{ display: "flex", alignItems: "center", gap: theme.spacing.lg }}
      >
        <span
          style={{
            color: "#000",
            fontSize: theme.fontSize.md,
          }}
        >
          {profile?.user_name} : {profile?.user_role}
        </span>

        <Space>
          <Badge
            count={notCompletedWorkloads ? notCompletedWorkloads.length : 0}
            size="small"
            offset={[-2, 2]}
          >
            <div
              onMouseEnter={() => setIsMailHovered(true)}
              onMouseLeave={() => setIsMailHovered(false)}
              style={{ display: "inline-block" }}
            >
              <Avatar
                onClick={showModal}
                style={{
                  backgroundColor: isMailHovered ? "#f0f0f0" : "#fff",
                  color: "#000",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease",
                }}
                icon={<MailOutlined />}
              />
            </div>
          </Badge>
        </Space>

        <Modal
          title="ภาระงานที่ไม่อนุมัติ"
          closable={{ "aria-label": "Custom Close Button" }}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
          footer={null}
        >

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    หัวข้อ
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    ระดับความเร่งด่วน
                  </th>
                  <th className="border-b p-4 text-sm font-semibold text-gray-600">
                    จัดการ
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {notCompletedWorkloads.map((workload) => {
                  let priorityColorClass = "bg-gray-100 text-gray-800";
                  let priorityText = workload.options.priority;

                  switch (workload.options.priority) {
                    case "high":
                      priorityColorClass = "bg-red-100 text-red-800";
                      priorityText = "สูง";
                      break;
                    case "medium":
                      priorityColorClass = "bg-yellow-100 text-yellow-800";
                      priorityText = "ปานกลาง";
                      break;
                    case "low":
                      priorityColorClass = "bg-green-100 text-green-800";
                      priorityText = "ต่ำ";
                      break;
                  }

                  return (
                    <tr key={workload.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                           <Text strong style={{ color: theme.primary }}>
                              {workload.options.title}
                           </Text>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${priorityColorClass}`}
                        >
                          {priorityText}
                        </span>
                      </td>
                      <td>
                        <Link to={`/head/_workload/edit/${workload.id}`}>
                          ตรวจสอบ
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {notCompletedWorkloads.length === 0 && (
              <div className="text-center py-4 text-gray-500">
                ไม่พบข้อมูล
              </div>
            )}
          </div>

        </Modal>

        <Button
          type="text"
          icon={<LogoutOutlined style={{ color: "#000" }} />}
          onClick={logout}
          style={{
            fontSize: theme.fontSize.md,
            color: "#000",
            height: "40px",
            padding: `0 ${theme.spacing.md}`,
            display: "flex",
            alignItems: "center",
            gap: theme.spacing.sm,
            borderRadius: theme.borderRadius.md,
            transition: theme.transition.default,
          }}
        >
          ออกจากระบบ
        </Button>
      </div>
    </Header>
  );
};

export default DeanHeader;
