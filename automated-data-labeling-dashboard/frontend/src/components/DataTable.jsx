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
  Row,
  Col,
} from "antd";
import API from "../services/api";

export default function DataTable({
  refreshStats = () => {},
  reloadFlag = false,
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [overrideModal, setOverrideModal] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [newLabel, setNewLabel] = useState("");

  const [reviewItem, setReviewItem] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const [searchText, setSearchText] = useState("");

  const [selectedStatuses, setSelectedStatuses] = useState([
    "pending",
    "accepted",
    "overridden",
  ]);

  const fetchItems = async () => {
    try {
      const res = await API.get("/items");
      setData(
        res.data.map((item) => ({
          key: item._id,
          raw: item.rawData.text || JSON.stringify(item.rawData),
          label: item.aiLabel || item.rawData.label || "-",
          status: item.status,
        }))
      );
    } catch (err) {
      message.error("Failed to load data");
    } finally {
      setLoading(false);
    }
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
            loading={actionLoading === record.key}
            disabled={record.status !== "pending"}
            onClick={async () => {
              setActionLoading(record.key);
              await acceptLabel(record.key);
              setActionLoading(null);
            }}
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

  // 🔹 FILTER + SEARCH LOGIC
  const filteredData = data.filter((item) => {
    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(item.status);

    const matchesSearch =
      searchText.trim() === "" ||
      item.raw.toLowerCase().includes(searchText.toLowerCase());

    return matchesStatus && matchesSearch;
  });

  return (
    <>
      {/* 🔹 SEARCH (LEFT) + FILTERS (RIGHT) */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
        <Col>
          <Input.Search
            placeholder="Search dataset..."
            allowClear
            style={{ width: 300 }}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </Col>

        <Col>
          <Checkbox.Group
            options={[
              { label: <Tag color="orange">Pending</Tag>, value: "pending" },
              { label: <Tag color="green">Accepted</Tag>, value: "accepted" },
              { label: <Tag color="red">Overridden</Tag>, value: "overridden" },
            ]}
            value={selectedStatuses}
            onChange={setSelectedStatuses}
          />
        </Col>
      </Row>

     

      {/* 🔹 TABLE */}
      <Table
        columns={columns}
        dataSource={filteredData}
        loading={loading}
        rowClassName={() => "interactive-row"}
        pagination={{ pageSize: 5 }}
        locale={{
          emptyText: (
            <div style={{ padding: 40, textAlign: "center" }}>
              <p style={{ fontSize: 16 }}>📂 No data uploaded yet</p>
              <p style={{ color: "#888" }}>
                Upload a CSV or JSON file to start labeling
              </p>
            </div>
          ),
        }}
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
