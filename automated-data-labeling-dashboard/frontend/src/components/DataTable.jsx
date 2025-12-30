import React from "react";
import { Table, Button, Tag } from "antd";

const columns = [
  {
    title: "Raw Data",
    dataIndex: "raw",
  },
  {
    title: "AI Label",
    dataIndex: "label",
  },
  {
    title: "Status",
    dataIndex: "status",
    render: (status) => (
      <Tag color={status === "pending" ? "orange" : "green"}>
        {status.toUpperCase()}
      </Tag>
    ),
  },
  {
    title: "Actions",
    render: () => (
      <>
        <Button type="link">Accept</Button>
        <Button type="link" danger>
          Override
        </Button>
      </>
    ),
  },
];

const data = [
  {
    key: "1",
    raw: "User comment text",
    label: "Positive",
    status: "pending",
  },
];

export default function DataTable() {
  return (
    <Table
      columns={columns}
      dataSource={data}
      pagination={false}
    />
  );
}
