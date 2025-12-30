import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic } from "antd";
import API from "../services/api";

export default function StatsBar() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    overridden: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await API.get("/stats");
      setStats(res.data);
    } catch (err) {
      console.error("Failed to load stats");
    }
  };

  return (
    <Card style={{ marginBottom: 20 }}>
      <Row gutter={16}>
        <Col span={6}>
          <Statistic title="Total Items" value={stats.total} />
        </Col>
        <Col span={6}>
          <Statistic title="Pending" value={stats.pending} />
        </Col>
        <Col span={6}>
          <Statistic title="Accepted" value={stats.accepted} />
        </Col>
        <Col span={6}>
          <Statistic title="Overridden" value={stats.overridden} />
        </Col>
      </Row>
    </Card>
  );
}
