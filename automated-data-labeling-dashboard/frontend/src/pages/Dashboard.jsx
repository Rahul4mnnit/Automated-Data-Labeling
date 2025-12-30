import React, { useEffect, useState } from "react";
import { Layout, Typography } from "antd";
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

  const fetchStats = async () => {
    const res = await API.get("/stats");
    setStats(res.data);
  };

  const triggerReload = () => {
    setReloadFlag((prev) => !prev);
    fetchStats(); // refresh stats also
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#001529" }}>
        <Title level={3} style={{ color: "white", margin: 0 }}>
          Automated Data Labeling Dashboard
        </Title>
      </Header>

      <Content style={{ padding: 24 }}>
        {/* 🔥 notify dashboard when upload succeeds */}
        <UploadDataset onUploadSuccess={triggerReload} />

        <StatsBar stats={stats} />

        {/* 🔥 reloadFlag forces re-fetch */}
        <DataTable
          refreshStats={fetchStats}
          reloadFlag={reloadFlag}
        />
      </Content>
    </Layout>
  );
}
