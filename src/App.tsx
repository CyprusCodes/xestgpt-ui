import React, { useEffect, useState } from "react";
import { MessageOutlined } from "@ant-design/icons";
import type { MenuProps, TabsProps } from "antd";
import { Layout, Menu, theme, Tabs } from "antd";
import TopBar from "./components/TopBar";
import ToolSelector from "./components/ToolSelector/index";
import SubmitButton from "./components/SubmitButton";
import Messages from "./components/Messages";
import parseToolDataIntoTreeFormat from "./utils/parseToolDataIntoTreeFormat";
import { ToolData, ToolTreeData } from "./types";

const { Content, Footer, Sider } = Layout;

const menuItems: MenuProps["items"] = [MessageOutlined].map((icon, index) => ({
  key: String(index + 1),
  icon: React.createElement(icon),
  label: `conversation ${index + 1}`,
}));

const onChange = (key: string) => {
  console.log(key);
};

async function postSessionMessage(
  messages: any,
  model: string,
  maxTokens: number,
  temperature: number,
  enabledTools: any
) {
  const url = "http://localhost:1313/session";
  const requestBody = {
    messages,
    model,
    maxTokens,
    temperature,
    enabledTools
  };

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Private-Network": "true",
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

async function getTools() {
  const url = "http://localhost:1313/tools";

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Private-Network": "true",
        // Add any additional headers if needed
      },
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
    return [];
  }
}

const App: React.FC = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [tools, setTools] = useState<ToolTreeData[]>([]);

  const getToolsFn = async () => {
    const toolsResponse = await getTools();
    setTools(parseToolDataIntoTreeFormat(toolsResponse.tools as ToolData[]));
  };

  useEffect(() => {
    getToolsFn();
  }, []);

  const [messages, setMessages] = useState([]);
  const [selectedTools, setSelectedTools] = useState<any>([]);

  const postSessionMessagesPatched = (messages: any) => {
    return postSessionMessage(
      messages,
      "gpt-3.5-turbo-1106",
      200,
      0,
      selectedTools
    );
  };

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
              height: "calc(100vh - 175px)",
            }}
          >
            <Content
              style={{ padding: "0 24px", minHeight: 280, overflow: "scroll" }}
            >
              <Messages
                messages={messages}
                setMessages={setMessages}
                postSessionMessage={postSessionMessagesPatched}
              />
            </Content>
            <Sider
              width={440}
              style={{
                background: colorBgContainer,
                borderLeft: "1px solid #f0f0f0",
              }}
            >
              {tools.length && (
                <Tabs
                  centered
                  defaultActiveKey="1"
                  items={[
                    {
                      key: "1",
                      label: "Tools",
                      children: (
                        <ToolSelector
                          initialToolTree={tools}
                          setSelectedTools={setSelectedTools}
                        />
                      ),
                    },
                  ]}
                  onChange={onChange}
                />
              )}
            </Sider>
          </Layout>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          <SubmitButton
            setMessages={setMessages}
            messages={messages}
            postSessionMessage={postSessionMessagesPatched}
          />
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
