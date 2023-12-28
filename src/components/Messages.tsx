import React from "react";
import { Card, Timeline, Badge, Dropdown, MenuProps, Button } from "antd";
import {
  ToolOutlined,
  RobotOutlined,
  UserOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  BackwardOutlined,
  ForkOutlined
} from "@ant-design/icons";

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
    message: `blah blah`,
    unuseful: false,
  },
];

const Messages = () => {
  return (
    <Timeline mode="left" style={{ paddingTop: "8px" }}>
      {messages.map((m) => {
        return (
          <Timeline.Item
            dot={
              <>
                {" "}
                <Dropdown
                  menu={menuProps}
                  placement="bottom"
                  
                ><Button icon={<m.icon style={{ fontSize: "20px", color: "green" }} />} style={{border: "none"}}></Button></Dropdown>
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
                <Card
                  actions={[
                    <DeleteOutlined
                      style={{ fontSize: "14px", color: "red" }}
                    />,

                    <ExclamationCircleOutlined
                      style={{ fontSize: "14px", color: "orange" }}
                    />,
                  ]}
                >
                  <p style={{ opacity: "0.5" }}>{m.message}</p>
                </Card>
              </Badge.Ribbon>
            ) : (
              <Card
                actions={[
                  <DeleteOutlined style={{ fontSize: "14px", color: "red" }} />,

                  <ExclamationCircleOutlined
                    style={{ fontSize: "14px", color: "orange" }}
                  />,
                ]}
              >
                <p>{m.message}</p>
              </Card>
            )}
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
};

export default Messages;
