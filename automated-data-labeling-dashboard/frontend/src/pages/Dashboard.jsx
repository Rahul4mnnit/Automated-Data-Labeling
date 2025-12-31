import React, { useEffect, useState } from "react";
import {
  Layout,
  Typography,
  message,
  Switch,
  Space,
  ConfigProvider,
  theme,
} from "antd";
import { BulbOutlined, MoonOutlined } from "@ant-design/icons";
import UploadDataset from "../components/UploadDataset";
import StatsBar from "../components/StatsBar";
import DataTable from "../components/DataTable";
import API from "../services/api";

const { Header, Content } = Layout;
const { Title } = Typography;

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    overridden: 0,
  });

  const [reloadFlag, setReloadFlag] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await API.get("/stats");
      setStats(res.data);
    } catch (err) {
      message.error("Failed to load statistics");
    }
  };

  const triggerReload = () => {
    setReloadFlag((prev) => !prev);
    fetchStats();
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: darkMode ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <Layout style={{ minHeight: "100vh" }}>
        {/* 🔹 STICKY HEADER */}
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
          }}
        >
          <Title level={3} style={{ margin: 0, color: "white" }}>
            Automated Data Labeling Dashboard
          </Title>

          {/* 🌙 DARK MODE TOGGLE */}
          <Space>
            <BulbOutlined style={{ color: "#fff", fontSize: 18 }} />

            <Switch
              checked={darkMode}
              onChange={setDarkMode}
              checkedChildren={<MoonOutlined style={{ color: "#fff" }} />}
              unCheckedChildren={<BulbOutlined style={{ color: "#fff" }} />}
            />

            <MoonOutlined style={{ color: "#fff", fontSize: 18 }} />
          </Space>
        </Header>

        {/* 🔹 CONTENT */}
        <Content style={{ padding: 24 }}>
          <UploadDataset onUploadSuccess={triggerReload} />
          <StatsBar stats={stats} />
          <DataTable refreshStats={fetchStats} reloadFlag={reloadFlag} />
        </Content>
      </Layout>
    </ConfigProvider>
  );
}
