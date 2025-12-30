import React from "react";
import { Button } from "antd";
import API from "../services/api";

export default function UploadDataset() {
  const testBackend = async () => {
    try {
      const res = await API.get("/upload/test");
      alert(res.data.message);
    } catch (err) {
      alert("Backend not connected");
    }
  };

  return (
    <Button type="primary" onClick={testBackend}>
      Test Backend Connection
    </Button>
  );
}
