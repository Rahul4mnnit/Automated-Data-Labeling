import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Input,
  message,
  Checkbox,
  Space,
} from "antd";
import API from "../services/api";

export default function DataTable({ refreshStats, reloadFlag }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [overrideModal, setOverrideModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [newLabel, setNewLabel] = useState("");

  const [reviewItem, setReviewItem] = useState(null);

  const [selectedStatuses, setSelectedStatuses] = useState([
    "pending",
    "accepted",
    "overridden",
  ]);

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
  }, [reloadFlag]);

  // ACCEPT
  const acceptLabel = async (id) => {
    await API.post(`/items/${id}/accept`);
    message.success("Label accepted");
    fetchItems();
    refreshStats();
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
    refreshStats();
  };

  const columns = [
    { title: "Raw Data", dataIndex: "raw" },
    { title: "Label", dataIndex: "label" },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <Tag
          color={
            status === "pending"
              ? "orange"
              : status === "accepted"
              ? "green"
              : "red"
          }
        >
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => setReviewItem(record)}>
            Review
          </Button>

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

  // 🔹 Apply status filter
  const filteredData = data.filter((item) =>
    selectedStatuses.includes(item.status)
  );

  return (
    <>
      {/* 🔹 STATUS FILTER */}
      <Space style={{ marginBottom: 16 }}>
        <Checkbox.Group
          options={[
            { label: "Pending", value: "pending" },
            { label: "Accepted", value: "accepted" },
            { label: "Overridden", value: "overridden" },
          ]}
          value={selectedStatuses}
          onChange={setSelectedStatuses}
        />
      </Space>

      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      {/* 🔹 REVIEW MODAL */}
      <Modal
        title="Review Data Item"
        open={!!reviewItem}
        onCancel={() => setReviewItem(null)}
        footer={null}
      >
        <p>
          <b>Text:</b>
        </p>
        <p>{reviewItem?.raw}</p>

        <p>
          <b>AI Label:</b>
        </p>
        <Tag color="blue">{reviewItem?.label}</Tag>

        <p style={{ marginTop: 10 }}>
          <b>Status:</b> {reviewItem?.status?.toUpperCase()}
        </p>
      </Modal>

      {/* 🔹 OVERRIDE MODAL */}
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
