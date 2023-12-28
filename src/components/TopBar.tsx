// TopBar.js
import React, { useState } from "react";
import {
  Layout,
  Menu,
  Dropdown,
  Badge,
  Modal,
  Button,
  theme,
  Col,
  Row,
  Statistic,
  Input,
  Select,
} from "antd";

import {
  UserOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  LikeOutlined,
} from "@ant-design/icons";

const { Header } = Layout;
const { Option } = Select;

const TopBar = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const [visible, setVisible] = useState(false);

  // Handle the model selection dropdown
  const handleModelSelect = (value: any) => {
    // Add your logic for handling model selection here
    console.log("Selected Model:", value);
  };

  // Handle the settings cog icon click
  const handleSettingsClick = () => {
    setVisible(true);
  };

  // Handle the settings modal close
  const handleModalClose = () => {
    setVisible(false);
  };

  // Dropdown menu for model selection
  const modelMenu = (
    <Menu onClick={({ key }) => handleModelSelect(key)}>
      <Menu.Item key="model1">Model 1</Menu.Item>
      <Menu.Item key="model2">Model 2</Menu.Item>
      {/* Add more model options as needed */}
    </Menu>
  );

  return (
    <Header style={{ backgroundColor: colorBgContainer }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "0 16px",
        }}
      >
        {/* Left side: Model Selection Dropdown */}
        <Dropdown overlay={modelMenu} placement="bottomLeft">
          <Button style={{ marginRight: 16 }}>Select Model</Button>
        </Dropdown>

        {/* Right side: Status Badges and Settings Cog */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <Statistic
            title="Cost"
            value="$0.001 / $0.01 (0%)"
            style={{ marginRight: 16 }}
            valueStyle={{ fontSize: "16px" }}
          />
          <Statistic
            title="Tokens"
            value="2000 / 4096 (50%)"
            style={{ marginRight: 16 }}
            valueStyle={{ fontSize: "16px" }}
          />

          <SettingOutlined
            onClick={handleSettingsClick}
            style={{ fontSize: "18px", cursor: "pointer" }}
          />
        </div>
      </div>

      {/* Settings Modal */}
      <Modal
        title="Settings"
        visible={visible}
        onOk={handleModalClose}
        onCancel={handleModalClose}
        okText="Save"
        cancelText="Cancel"
      >
        {/* Output Token Length */}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="outputTokenLength">Output Token Length:</label>
          <Input id="outputTokenLength" type="number" />
        </div>

        {/* Ask Permission Before Function Runs */}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="askPermission">
            Ask Permission Before Function Runs:
          </label>
          <Select
            id="askPermission"
            style={{ width: "100%" }}
            defaultValue="all"
          >
            <Option value="all">All</Option>
            <Option value="onlyDangerous">Only Dangerous</Option>
            <Option value="onlyUi">Only UI</Option>
            <Option value="onlyApi">Only API</Option>
            <Option value="none">None</Option>
          </Select>
        </div>

        {/* Cost Limit */}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="costLimit">Cost Limit ($):</label>
          <Input id="costLimit" type="number" step="0.01" />
        </div>

        {/* Context Limit */}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="contextLimit">Max Token Limit:</label>
          <Input id="contextLimit" type="number" />
        </div>
      </Modal>
    </Header>
  );
};

export default TopBar;
