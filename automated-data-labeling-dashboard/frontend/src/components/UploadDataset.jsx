import React from "react";
import { Upload, Button, Card } from "antd";
import { UploadOutlined } from "@ant-design/icons";

export default function UploadDataset() {
  return (
    <Card title="Upload Dataset" style={{ marginBottom: 20 }}>
      <Upload>
        <Button icon={<UploadOutlined />}>Upload CSV / JSON</Button>
      </Upload>
    </Card>
  );
}
