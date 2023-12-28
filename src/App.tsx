import React, {useState} from "react";
import {
  AppstoreOutlined,
  BarChartOutlined,
  CloudOutlined,
  ShopOutlined,
  TeamOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
  LaptopOutlined,
  NotificationOutlined,
} from "@ant-design/icons";
import type { MenuProps, TabsProps } from "antd";
import { Layout, Menu, theme, Tabs } from "antd";
import TopBar from "./components/TopBar";
import ToolSelector from "./components/ToolSelector";
import SubmitButton from "./components/SubmitButton";
import Messages from "./components/Messages";

const { Header, Content, Footer, Sider } = Layout;

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

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
              height: 'calc(100vh - 235px)'
            }}
          >
            <Content style={{ padding: "0 24px", minHeight: 280, overflow: "scroll" }}>
              <Messages/>
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
          <SubmitButton />
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
