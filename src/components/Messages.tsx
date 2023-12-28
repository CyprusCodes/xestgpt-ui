import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

import { Card, Timeline, Badge, Dropdown, MenuProps, Button, Tabs } from "antd";
import {
  ToolOutlined,
  RobotOutlined,
  UserOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  BackwardOutlined,
  ForkOutlined,
  StopOutlined
} from "@ant-design/icons";

const { TabPane } = Tabs;

const items: MenuProps["items"] = [
  {
    label: "rewind to here",
    key: "1",
    icon: <BackwardOutlined />,
  },
  {
    label: "fork to new window",
    key: "2",
    icon: <ForkOutlined />,
  },
  {
    label: "delete",
    key: "3",
    icon: <DeleteOutlined style={{ fontSize: "14px", color: "red" }} />,
  },
  {
    label: "flag as irrelevant",
    key: "4",
    icon: (
      <ExclamationCircleOutlined
        style={{ fontSize: "14px", color: "orange" }}
      />
    ),
  },
];

const menuProps = {
  items,
  onClick: () => {},
};

const messages = [
  {
    icon: UserOutlined,
    message: `I want to generate some database migrations.`,
    unuseful: false,
  },
  {
    icon: RobotOutlined,
    message: "Sure, let me know what changes you need.",
    unuseful: true,
  },
  {
    icon: UserOutlined,
    message: `add 2 new columns to users table to capture created_at and updated_at times`,
    unuseful: false,
  },
  {
    icon: ToolOutlined,
    message: `blah blah`,
    unuseful: false,
  },
  {
    icon: RobotOutlined,
    message: "Sure, let me know what changes you need.",
    unuseful: false,
  },
  {
    icon: UserOutlined,
    message: `add 2 new columns to users table to capture created_at and updated_at times`,
    unuseful: false,
  },
  {
    icon: ToolOutlined,
    message: ``,
    unuseful: false,
    type: "tool",
    tool: {
      name: "get_dependencies",
      args: { dependecyDepth: 1, path: "src/components/Modal.tsx" },
      confirmed: true,
      output: `Here are the list of dependencies`,
    },
  },
  {
    icon: ToolOutlined,
    message: ``,
    unuseful: false,
    tool: {
      name: "get_dependencies",
      args: { dependecyDepth: 1, path: "src/components/Modal.tsx" },
      confirmed: false,
      output: ``,
    },
  },
  {
    icon: ToolOutlined,
    message: ``,
    unuseful: false,
    tool: {
      name: "get_dependencies",
      args: { dependecyDepth: 1, path: "src/components/Modal.tsx" },
      confirmed: null,
      output: ``,
    },
  },
];

const renderMessageCard = (message: any) => {
  if (message.unuseful) {
    return (
      <Card>
        <p style={{ opacity: 0.5 }}>{message.message}</p>
      </Card>
    );
  }

  if (message.tool) {
    const toolDetails = message.tool;
    const isRejected = toolDetails.confirmed === false;
    const Ribbon = isRejected ? Badge.Ribbon : React.Fragment;

    return (
      <Ribbon
        text={
          <>
            <StopOutlined
              style={{ fontSize: "14px", color: "white" }}
            />{" "}
            user rejected
          </>
        }
        color="red"
      >
        <Card
          bodyStyle={{ paddingTop: "0" }}
          title={
            <>
              use tool:{" "}
              <span style={{ color: "green", fontWeight: "bold" }}>
                {toolDetails.name}
              </span>
            </>
          }
        >
          <Tabs defaultActiveKey="1">
            <TabPane tab="Call Arguments" key="1">
              <SyntaxHighlighter language="javascript" style={oneDark}>
                {JSON.stringify(toolDetails.args, null, 2)}
              </SyntaxHighlighter>
            </TabPane>
            {toolDetails.confirmed === true && (
              <TabPane tab="Output" key="2">
                <p>{toolDetails.output}</p>
              </TabPane>
            )}
          </Tabs>
        </Card>
      </Ribbon>
    );
  }

  return (
    <Card>
      <p>{message.message}</p>
    </Card>
  );
};

const Messages = () => {
  return (
    <Timeline mode="left" style={{ paddingTop: "8px" }}>
      {messages.map((m) => {
        return (
          <Timeline.Item
            dot={
              <>
                {" "}
                <Dropdown menu={menuProps} placement="bottom">
                  <Button
                    icon={
                      <m.icon style={{ fontSize: "24px", color: "green" }} />
                    }
                    style={{ border: "none" }}
                  ></Button>
                </Dropdown>
              </>
            }
            color="green"
            style={{ paddingTop: "12px" }}
          >
            {m.unuseful ? (
              <Badge.Ribbon
                text={
                  <>
                    <ExclamationCircleOutlined
                      style={{ fontSize: "14px", color: "white" }}
                    />{" "}
                    irrelevant
                  </>
                }
                color="orange"
              >
                {renderMessageCard(m)}
              </Badge.Ribbon>
            ) : (
              renderMessageCard(m)
            )}
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
};

export default Messages;
