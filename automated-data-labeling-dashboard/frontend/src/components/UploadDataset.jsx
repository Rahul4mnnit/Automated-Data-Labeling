import React, { useRef, useState } from "react";
import { Upload, Button, Card, message, Progress, Space } from "antd";
import { UploadOutlined, CloseCircleOutlined } from "@ant-design/icons";
import API from "../services/api";

const { Dragger } = Upload;

export default function UploadDataset({ onUploadSuccess }) {
  const [uploadPercent, setUploadPercent] = useState(0);
  const [uploading, setUploading] = useState(false);
  const abortControllerRef = useRef(null);

  const beforeUpload = (file) => {
    const isValidType = file.type === "text/csv" || file.name.endsWith(".json");

    if (!isValidType) {
      message.error("Only CSV or JSON files are allowed");
      return Upload.LIST_IGNORE;
    }

    const isValidSize = file.size / 1024 / 1024 < 5;
    if (!isValidSize) {
      message.error("File must be smaller than 5MB");
      return Upload.LIST_IGNORE;
    }

    return true;
  };

  const handleUpload = async ({ file }) => {
    const formData = new FormData();
    formData.append("file", file);

    setUploading(true);
    setUploadPercent(0);

    // ✅ Modern cancel controller
    abortControllerRef.current = new AbortController();

    try {
      const res = await API.post("/upload", formData, {
        signal: abortControllerRef.current.signal,
        onUploadProgress: (e) => {
          if (!e.total) return;
          const percent = Math.round((e.loaded * 100) / e.total);
          setUploadPercent(percent);
        },
      });

      message.success(res.data.message || "File uploaded successfully");
      setUploading(false);
      setUploadPercent(0);
      onUploadSuccess && onUploadSuccess();
    } catch (err) {
      if (err.name === "CanceledError") {
        message.warning("Upload cancelled");
      } else {
        console.error(err);
        message.error("Upload failed");
      }
      setUploading(false);
      setUploadPercent(0);
    }
  };

  const cancelUpload = () => {
    abortControllerRef.current?.abort();
  };

  return (
    <Card title="Upload Dataset" style={{ marginBottom: 24 }}>
      <Dragger
        customRequest={handleUpload}
        beforeUpload={beforeUpload}
        showUploadList={false}
        disabled={uploading}
        multiple={false}
      >
        <p className="ant-upload-drag-icon">
          <UploadOutlined />
        </p>
        <p className="ant-upload-text">
          Click or drag CSV / JSON file to upload
        </p>
        <p className="ant-upload-hint">Max size: 5MB</p>
      </Dragger>

      {uploading && (
        <>
          <Progress
            percent={uploadPercent}
            status="active"
            strokeColor="#1677ff"
            style={{ marginTop: 16 }}
          />

          <Space style={{ marginTop: 8 }}>
            <Button
              danger
              icon={<CloseCircleOutlined />}
              onClick={cancelUpload}
            >
              Cancel Upload
            </Button>
          </Space>
        </>
      )}
    </Card>
  );
}
