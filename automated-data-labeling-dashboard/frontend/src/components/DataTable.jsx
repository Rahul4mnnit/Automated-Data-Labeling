import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import API from "../services/api";

export default function DataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const res = await API.get("/items");
      const formatted = res.data.map((item) => ({
        key: item._id,
        raw: item.rawData.text || JSON.stringify(item.rawData),
        label: item.aiLabel || item.rawData.label || "-",
        status: item.status,
      }));
      setData(formatted);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

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
  ];

  return (
    <Table
      columns={columns}
      dataSource={data}
      loading={loading}
      pagination={{ pageSize: 5 }}
    />
  );
}
