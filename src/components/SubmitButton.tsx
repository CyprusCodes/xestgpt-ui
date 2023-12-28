import React from "react";
import { Input, Button, Upload, Space } from "antd";
import { UploadOutlined, SendOutlined } from "@ant-design/icons";
import "./SubmitButton.css";

const { TextArea } = Input;

const SubmitButton = () => {
  const handleFileChange = (info: any) => {
    // Handle file changes here
    console.log(info.fileList);
  };

  const handleSendClick = () => {
    // Handle sending logic here
    console.log("Send button clicked");
  };

  return (
    <div className="custom-container">
      <Space className="custom-space">
        {/* File Selection Button */}
        <Upload
          showUploadList={false}
          beforeUpload={() => false} // To prevent automatic upload
          onChange={handleFileChange}
        >
          <Button icon={<UploadOutlined />} className="custom-button" />
        </Upload>

        {/* Multi-line Input */}
        <TextArea
          rows={3}
          className="custom-textarea"
          style={{ resize: "none", height: "100px" }}
        />

        {/* Send Button */}
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSendClick}
          className="custom-button"
        >
          Send
        </Button>
      </Space>
    </div>
  );
};

export default SubmitButton;
