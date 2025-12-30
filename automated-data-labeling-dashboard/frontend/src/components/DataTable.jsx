import React, { useEffect, useState } from "react";
import { Table, Tag, Button, Modal, Input, message } from "antd";
import API from "../services/api";

export default function DataTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [overrideModal, setOverrideModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [newLabel, setNewLabel] = useState("");

  const fetchItems = async () => {
    const res = await API.get("/items");
    setData(
      res.data.map((item) => ({
        key: item._id,
        raw: item.rawData.text || JSON.stringify(item.rawData),
        label: item.aiLabel || item.rawData.label || "-",
        status: item.status,
      }))
    );
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // ACCEPT
  const acceptLabel = async (id) => {
    await API.post(`/items/${id}/accept`);
    message.success("Label accepted");
    fetchItems();
  };

  // OVERRIDE
  const submitOverride = async () => {
    await API.post(`/items/${selectedId}/override`, {
      label: newLabel,
    });
    message.success("Label overridden");
    setOverrideModal(false);
    setNewLabel("");
    fetchItems();
  };

  const columns = [
    { title: "Raw Data", dataIndex: "raw" },
    { title: "Label", dataIndex: "label" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag color={status === "pending" ? "orange" : status === "accepted" ? "green" : "red"}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button
            type="link"
            disabled={record.status !== "pending"}
            onClick={() => acceptLabel(record.key)}
          >
            Accept
          </Button>
          <Button
            type="link"
            danger
            disabled={record.status !== "pending"}
            onClick={() => {
              setSelectedId(record.key);
              setOverrideModal(true);
            }}
          >
            Override
          </Button>
        </>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title="Override Label"
        open={overrideModal}
        onOk={submitOverride}
        onCancel={() => setOverrideModal(false)}
      >
        <Input
          placeholder="Enter new label"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
        />
      </Modal>
    </>
  );
}
