import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/vs2015.css";

import {
  Card,
  Timeline,
  Badge,
  Dropdown,
  MenuProps,
  Button,
  Tabs,
  Space,
  Empty,
} from "antd";
import {
  ToolOutlined,
  RobotOutlined,
  UserOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  BackwardOutlined,
  ForkOutlined,
  StopOutlined,
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { Message, MessageRole, ToolDetails } from "../types";

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

const patchLastMessageToolInfo = (messages: Message[], toolInfo: Pick<ToolDetails, "confirmed" | "output" | "runAt">): Message[] => {
  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role !== MessageRole.FUNCTION) {
    return messages;
  }

  const shallowCopyOfMessagesWithoutLast = messages.slice(
    0,
    -1
  );
  const copyOfLastMessage = { ...lastMessage };
  copyOfLastMessage.tool = {
    ...copyOfLastMessage.tool,
    ...toolInfo
  };
  const newMessages = [
    ...shallowCopyOfMessagesWithoutLast,
    lastMessage,
  ];

  return newMessages;
}

const renderMessageCard = (
  message: Message,
  messages: Message[],
  setMessages: React.Dispatch<Message[]>,
  postSessionMessage: any
) => {
  if (message.unuseful) {
    return (
      <Card>
        <p style={{ opacity: 0.5 }}>{message.message}</p>
      </Card>
    );
  }

  if (message.role === MessageRole.FUNCTION && message.tool) {
    const toolDetails = message.tool;
    const isRejected = toolDetails.confirmed === false;
    const isWaitingResponse =
      toolDetails.confirmed !== false && toolDetails.confirmed !== true;
    let Ribbon: any = React.Fragment;
    let ribbonProps = {};

    if (isRejected) {
      Ribbon = Badge.Ribbon;
      ribbonProps = {
        text: (
          <>
            <StopOutlined style={{ fontSize: "14px", color: "white" }} /> user
            rejected
          </>
        ),
        color: "red",
      };
    }

    if (isWaitingResponse) {
      Ribbon = Badge.Ribbon;
      ribbonProps = {
        text: (
          <>
            <ClockCircleOutlined style={{ fontSize: "14px", color: "white" }} />{" "}
            waiting user confirmation
          </>
        ),
        color: "orange",
      };
    }

    return (
      <Ribbon {...ribbonProps}>
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
              {isWaitingResponse && (
                <Space>
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => {
                      const newMessages = patchLastMessageToolInfo(messages, { confirmed: true });
                      setMessages(newMessages);

                      // todo: if tool is backend post the message

                      postSessionMessage(newMessages).then((data: any) => {
                        if (data.messages) {
                          setMessages(data.messages);
                        }
                      });
                      // todo: else
                      // if the tool type is UI
                      // switch to output tab
                      // display the tool
                    }}
                  >
                    Accept and run tool
                  </Button>
                  <Button
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => {
                      const newMessages = patchLastMessageToolInfo(messages, { confirmed: false });
                      setMessages(newMessages);
                      postSessionMessage(newMessages).then((data: any) => {
                        if (data.messages) {
                          setMessages(data.messages);
                        }
                      });
                    }}
                  >
                    Reject tool
                  </Button>
                </Space>
              )}
            </TabPane>
            {toolDetails.confirmed === true && (
              <TabPane tab="Output" key="2">
                {/* todo: tool type ui: then render component, with AI provided params */}
                <p>{toolDetails.output}</p>
              </TabPane>
            )}
          </Tabs>
        </Card>
      </Ribbon>
    );
  }

  // todo
  // https://blog.designly.biz/react-markdown-how-to-create-a-copy-code-button#google_vignette
  return (
    <Card>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
      >
        {message.message}
      </ReactMarkdown>
    </Card>
  );
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

const Messages = ({ messages, setMessages, postSessionMessage }: any) => {
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
      {messages.map((m: any) => {
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
                {renderMessageCard(
                  m,
                  messages,
                  setMessages,
                  postSessionMessage
                )}
              </Badge.Ribbon>
            ) : (
              renderMessageCard(m, messages, setMessages, postSessionMessage)
            )}
          </Timeline.Item>
        );
      })}
    </Timeline>
  );
};

export default Messages;
