import React, { useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/vs2015.css";

import { Card, Badge, Button, Tabs, Space } from "antd";
import {
  StopOutlined,
  CheckOutlined,
  CloseOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import {
  Message,
  MessageRole,
  ToolData,
  FunctionType,
  ToolDetails,
} from "../types";
import UIToolComponent from "../ui-tools";

const { TabPane } = Tabs;

const confirmToolRun = ({
  messageId,
  messages,
  setMessages,
  toolData,
  postSessionMessage,
  toolPaneSelection,
  setToolPaneSelection,
}: {
    messageId: string,
    messages: Message[],
    setMessages: React.Dispatch<Message[]>;
    postSessionMessage: any;
    toolData?: ToolData;
    toolPaneSelection: Record<string, string>;
    setToolPaneSelection: React.Dispatch<Record<string, string>>;
}) => {
  const newMessages = patchLastMessageToolInfo(messages, {
    confirmed: true,
  });
  setMessages(newMessages);

  if (toolData?.functionType === FunctionType.BACKEND) {
    postSessionMessage(newMessages).then((data: any) => {
      if (data.messages) {
        setMessages(data.messages);
      }
    });
  } else if (toolData?.functionType === FunctionType.UI) {
    setToolPaneSelection({
      ...toolPaneSelection,
      [messageId]: "2",
    });
  }
};

const patchLastMessageToolInfo = (
  messages: Message[],
  toolInfo: Pick<ToolDetails, "confirmed" | "output" | "runAt">
): Message[] => {
  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role !== MessageRole.FUNCTION) {
    return messages;
  }

  const shallowCopyOfMessagesWithoutLast = messages.slice(0, -1);
  const copyOfLastMessage = { ...lastMessage };
  copyOfLastMessage.tool = {
    ...copyOfLastMessage.tool,
    ...toolInfo,
  };
  const newMessages = [...shallowCopyOfMessagesWithoutLast, copyOfLastMessage];

  return newMessages;
};

interface MessageCardProps {
  message: Message;
  messages: Message[];
  setMessages: React.Dispatch<Message[]>;
  postSessionMessage: any;
  tools: ToolData[];
  toolPaneSelection: Record<string, string>;
  setToolPaneSelection: React.Dispatch<Record<string, string>>;
}

const MessageCard: React.FC<MessageCardProps> = ({
  message,
  messages,
  setMessages,
  postSessionMessage,
  tools,
  toolPaneSelection,
  setToolPaneSelection,
}) => {
  useEffect(() => {
    if (message.role === MessageRole.FUNCTION && message.tool) {
      const toolCallDetails = message.tool;
      // todo: this should be matched on tool id, not name (requires backend change)
      const toolData = tools.find((t) => {
        return t.name === toolCallDetails.name;
      });
      let isWaitingResponse =
        toolCallDetails.confirmed !== false &&
        toolCallDetails.confirmed !== true;
      if (isWaitingResponse) {
        // check if user has enabled auto-confirmation for this type of tool

        confirmToolRun({
          messageId: message.id,
          messages,
          setMessages,
          toolData,
          postSessionMessage,
          toolPaneSelection,
          setToolPaneSelection,
        });
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (message.unuseful) {
    return (
      <Card>
        <p style={{ opacity: 0.5 }}>{message.message}</p>
      </Card>
    );
  }

  if (message.role === MessageRole.FUNCTION && message.tool) {
    const toolCallDetails = message.tool;

    // todo: this should be matched on tool id, not name (requires backend change)
    const toolData = tools.find((t) => {
      return t.name === toolCallDetails.name;
    });

    const isRejected = toolCallDetails.confirmed === false;
    const isWaitingResponse =
      toolCallDetails.confirmed !== false && toolCallDetails.confirmed !== true;

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
      <Ribbon {...ribbonProps} key={message.id}>
        <Card
          bodyStyle={{ paddingTop: "0" }}
          title={
            <>
              use tool:{" "}
              <span style={{ color: "green", fontWeight: "bold" }}>
                {toolCallDetails.name}
              </span>
            </>
          }
        >
          <Tabs
            activeKey={toolPaneSelection[message.id] || "1"}
            onChange={(newKey) => {
              setToolPaneSelection({
                ...toolPaneSelection,
                [message.id]: newKey,
              });
            }}
          >
            <TabPane tab="Call Arguments" key="1">
              <SyntaxHighlighter language="javascript" style={oneDark}>
                {JSON.stringify(toolCallDetails.args, null, 2)}
              </SyntaxHighlighter>
              {isWaitingResponse && (
                <Space>
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => {
                      confirmToolRun({
                        messageId: message.id,
                        messages,
                        setMessages,
                        toolData,
                        postSessionMessage,
                        toolPaneSelection,
                        setToolPaneSelection,
                      });
                    }}
                  >
                    Accept and run tool
                  </Button>
                  <Button
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => {
                      const newMessages = patchLastMessageToolInfo(messages, {
                        confirmed: false,
                      });
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
            {toolCallDetails.confirmed === true && (
              <TabPane tab="Output" key="2">
                {toolData?.functionType === FunctionType.UI ? (
                  <ErrorBoundary
                    fallback={
                      <div>
                        Failed to render {toolCallDetails.name} tool. Please
                        report this error.
                      </div>
                    }
                    onError={(error) => {
                      // todo: report this error to some central place
                      // with tool name, args, and conversation id
                      console.log("captured error", error);
                    }}
                  >
                    <UIToolComponent
                      functionName={toolCallDetails.name}
                      functionArgs={toolCallDetails.args}
                      previousRunResults={toolCallDetails.output}
                      captureResults={(msg: string) => {
                        const newMessages = patchLastMessageToolInfo(messages, {
                          output: msg,
                          runAt: new Date().toISOString(),
                        });
                        setMessages(newMessages);
                        postSessionMessage(newMessages).then((data: any) => {
                          if (data.messages) {
                            setMessages(data.messages);
                          }
                        });
                      }}
                    />
                  </ErrorBoundary>
                ) : (
                  <p>{toolCallDetails.output}</p>
                )}
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

export default MessageCard;
