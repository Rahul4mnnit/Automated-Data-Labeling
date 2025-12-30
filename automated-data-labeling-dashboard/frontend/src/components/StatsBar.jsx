import React from "react";
import { Card, Row, Col, Statistic } from "antd";

export default function StatsBar() {
  return (
    <Card style={{ marginBottom: 20 }}>
      <Row gutter={16}>
        <Col span={6}>
          <Statistic title="Total Items" value={120} />
        </Col>
        <Col span={6}>
          <Statistic title="Pending" value={45} />
        </Col>
        <Col span={6}>
          <Statistic title="Accepted" value={60} />
        </Col>
        <Col span={6}>
          <Statistic title="Overridden" value={15} />
        </Col>
      </Row>
    </Card>
  );
}
