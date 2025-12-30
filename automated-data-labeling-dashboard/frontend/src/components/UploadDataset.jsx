import React from "react";
import { Upload, Button, Card, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import API from "../services/api";

export default function UploadDataset() {
  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await API.post("/upload", formData);
      message.success(res.data.message || "File uploaded");
      console.log(res.data);
    } catch (err) {
      message.error("Upload failed");
    }
  };

  return (
    <Card title="Upload Dataset">
      <Upload customRequest={handleUpload} showUploadList={false}>
        <Button type="primary" icon={<UploadOutlined />}>
          Upload CSV / JSON
        </Button>
      </Upload>
    </Card>
  );
}
