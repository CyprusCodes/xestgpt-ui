import React, { useState, ReactNode } from "react";
import "highlight.js/styles/vs2015.css";

import { Timeline, Badge, Dropdown, MenuProps, Button, Empty } from "antd";
import {
  ToolOutlined,
  RobotOutlined,
  UserOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  BackwardOutlined,
  ForkOutlined,
} from "@ant-design/icons";
import { Message, ToolData } from "../types";
import MessageCard from "./Message";

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

const getMessageIcon = (role: string) => {
  if (role === "assistant") {
    return <RobotOutlined style={{ fontSize: "24px", color: "green" }} />;
  }

  if (role === "function") {
    return <ToolOutlined style={{ fontSize: "24px", color: "green" }} />;
  }

  return <UserOutlined style={{ fontSize: "24px", color: "green" }} />;
};

interface WrapProps {
  if: boolean;
  with: (children: React.ReactNode) => JSX.Element;
  children?: ReactNode;
}

export const Wrap: React.FC<WrapProps> = ({
  if: condition,
  with: wrapper,
  children,
}) => {
  return condition ? wrapper(children) : <>{children}</>;
};

const MessageTimeline = ({
  messages,
  setMessages,
  postSessionMessage,
  tools,
}: {
  messages: Message[];
  setMessages: React.Dispatch<Message[]>;
  postSessionMessage: (messages: Message[]) => Promise<any>;
  tools: ToolData[];
}) => {
  const [toolPaneSelection, setToolPaneSelection] = useState<
    Record<string, string>
  >({});
  if (!messages.length) {
    return (
      <Empty
        image="https://user-images.githubusercontent.com/1476886/147765281-e871657c-37a8-495d-b08b-c5dccf6334c3.png"
        imageStyle={{ height: "200px" }}
        description={
          <h3 style={{ color: "green" }}>
            Welcome to XestGPT. Ask questions about your codebase and get
            instant answers.
          </h3>
        }
      ></Empty>
    );
  }

  return (
    <Timeline mode="left" style={{ paddingTop: "8px" }}>
      {messages.map((m: Message) => {
        if (m.hiddenFromUser) {
          return null;
        }
        return (
          <Timeline.Item
            dot={
              <>
                {" "}
                <Dropdown menu={menuProps} placement="bottom">
                  <Button
                    icon={getMessageIcon(m.role)}
                    style={{ border: "none" }}
                  ></Button>
                </Dropdown>
              </>
            }
            color="green"
            style={{ paddingTop: "12px" }}
          >
            <Wrap
              if={m.unuseful}
              with={(children) => (
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
                  {children}
                </Badge.Ribbon>
              )}
            >
              <MessageCard
                message={m}
                messages={messages}
                setMessages={setMessages}
                postSessionMessage={postSessionMessage}
                tools={tools}
                toolPaneSelection={toolPaneSelection}
                setToolPaneSelection={setToolPaneSelection}
              />
            </Wrap>
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
};

export default MessageTimeline;
