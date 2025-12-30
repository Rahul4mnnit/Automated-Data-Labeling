import React from "react";
import { Layout, Typography } from "antd";
import UploadDataset from "../components/UploadDataset";
import StatsBar from "../components/StatsBar";
import DataTable from "../components/DataTable";

const { Header, Content } = Layout;
const { Title } = Typography;

export default function Dashboard() {
  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Header style={{ background: "#001529" }}>
        <Title level={3} style={{ color: "white", margin: 0 }}>
          Automated Data Labeling Dashboard
        </Title>
      </Header>

      <Content style={{ padding: "24px" }}>
        <UploadDataset />
        <StatsBar />
        <DataTable />
      </Content>
    </Layout>
  );
}
