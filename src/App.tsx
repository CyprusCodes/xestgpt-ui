import React, { useState } from "react";
import {
  BarChartOutlined,
  CloudOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import type { MenuProps, TabsProps } from "antd";
import { Layout, Menu, theme, Tabs } from "antd";
import TopBar from "./components/TopBar";
import ToolSelector from "./components/ToolSelector";
import SubmitButton from "./components/SubmitButton";
import Messages from "./components/Messages";

const { Content, Footer, Sider } = Layout;

const menuItems: MenuProps["items"] = [
  UserOutlined,
  VideoCameraOutlined,
  UploadOutlined,
  BarChartOutlined,
  CloudOutlined,
].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `conversation ${index + 1}`,
}));

const onChange = (key: string) => {
  console.log(key);
};

const items: TabsProps["items"] = [
  {
    key: "1",
    label: "Tools",
    children: <ToolSelector />,
  },
  {
    key: "2",
    label: "Knowledge Base",
    children: <ToolSelector />,
  },
];

async function postSessionMessage(messages: any) {
  console.log("here???");
  const url = "http://localhost:1313/session";
  const requestBody = {
    messages,
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Private-Network": "true"
        // Add any additional headers if needed
      },
      body: JSON.stringify(requestBody),
    });

    // Check if the request was successful (status code 2xx)
    if (response.ok) {
      const data = await response.json(); // Parse the response body as JSON
      return data;
    } else {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }
  } catch (error) {
    // Handle errors during the fetch
    console.error("Fetch Error:", error);
  }
}

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const [messages, setMessages] = useState([]);

  return (
    <Layout hasSider>
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["4"]}
          items={menuItems}
        />
      </Sider>
      <Layout style={{ marginLeft: 200 }}>
        <TopBar></TopBar>
        <Content style={{ padding: "10px 48px" }}>
          <Layout
            style={{
              padding: "24px 0",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              height: "calc(100vh - 235px)",
            }}
          >
            <Content
              style={{ padding: "0 24px", minHeight: 280, overflow: "scroll" }}
            >
              <Messages messages={messages} setMessages={setMessages} postSessionMessage={postSessionMessage} />
            </Content>
            <Sider
              width={300}
              style={{
                background: colorBgContainer,
                borderLeft: "1px solid #f0f0f0",
              }}
            >
              <Tabs
                centered
                defaultActiveKey="1"
                items={items}
                onChange={onChange}
              />
            </Sider>
          </Layout>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          <SubmitButton
            setMessages={setMessages}
            messages={messages}
            postSessionMessage={postSessionMessage}
          />
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
