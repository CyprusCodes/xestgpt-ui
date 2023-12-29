import React, { useState } from "react";
import { Input, Button, Upload, Space } from "antd";
import { UploadOutlined, SendOutlined } from "@ant-design/icons";
import "./SubmitButton.css";

const { TextArea } = Input;

const SubmitButton = ({ setMessages, postSessionMessage, messages }: any) => {
  const [textAreaValue, setTextAreaValue] = useState("");

  const handleFileChange = (info: any) => {
    // Handle file changes here
    console.log(info.fileList);
  };

  const handleSendClick = () => {
    // Read the textarea content
    const newUserMessage = {
      unuseful: false,
      hiddenFromUser: false,
      role: "user",
      message: textAreaValue,
    };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);

    postSessionMessage(newMessages).then((data: any) => {
        if(data.messages) {
            setMessages(data.messages);
        }
    });
    setTextAreaValue("");
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    // Update the state with the textarea content
    setTextAreaValue(e.target.value);
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
          value={textAreaValue}
          onChange={handleTextAreaChange}
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
