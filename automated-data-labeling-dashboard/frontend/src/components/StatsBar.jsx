import React from "react";
import { Card, Row, Col, Statistic } from "antd";

export default function StatsBar({ stats }) {
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
