import React from "react";
import { Upload, Button, Card, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import API from "../services/api";

export default function UploadDataset({ onUploadSuccess }) {
  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/upload", formData);
      message.success(res.data.message || "File uploaded successfully");

      // 🔥 notify Dashboard to refresh table + stats
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      console.error(err.response?.data || err.message);
      message.error("Upload failed");
    }
  };

  return (
    <Card title="Upload Dataset" style={{ marginBottom: 20 }}>
      <Upload customRequest={handleUpload} showUploadList={false}>
        <Button type="primary" icon={<UploadOutlined />}>
          Upload CSV / JSON
        </Button>
      </Upload>
    </Card>
  );
}
