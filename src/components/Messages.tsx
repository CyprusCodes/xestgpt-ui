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

/*
const messages = [
  {
    role: "user",
    message: "can you help me write a new database migration?",
    unuseful: false,
    hiddenFromUser: false,
  },
  {
    message:
      "Of course! I can help you with that. To get started, I'll need to know the details of the database migration you want to create. Specifically, I'll need to know the changes you want to make to the database schema. This could include creating new tables, modifying existing tables, adding or removing columns, etc. Once I have that information, I can assist you in writing the migration script.",
    role: "assistant",
    unuseful: false,
    hiddenFromUser: false,
  },
  {
    role: "user",
    message:
      "ok, investigate the database and create 2 new craeted_at and updated_at columns at users table",
    unuseful: false,
    hiddenFromUser: false,
  },
  {
    message: null,
    role: "function",
    unuseful: false,
    hiddenFromUser: false,
    tool: {
      name: "get_list_of_database_tables",
      args: {},
      confirmed: true,
      runAt: "2023-12-29T07:33:13.715Z",
      output:
        '"blog_categories\\nblog_comment_replies\\nblog_comments\\nblog_status\\nblog_tags\\nblogs\\nchapters\\ncode_katas\\ncohorts\\nkata_progress\\nmigrations\\nmodule_dates\\nmodule_definitions\\nmodule_instructors\\nmodules\\npage_assets\\npage_feedback\\npage_questions\\npage_quiz\\npages\\npassword_recovery_requests\\nprograms\\nsubscriptions\\ntags\\nuser_ledgers\\nuser_modules\\nuser_pageviews\\nuser_payments\\nuser_progress\\nuser_quiz_attempts\\nuser_types\\nusers"',
    },
  },
  {
    unuseful: false,
    hiddenFromUser: true,
    role: "user",
    message:
      "Consider the output of the get_list_of_database_tables. Does this give you enough information to answer my query? Think step by step. Run tools if necessary, using the previous information collected where applicable.",
  },
  {
    message: null,
    role: "function",
    unuseful: false,
    hiddenFromUser: false,
    tool: {
      name: "get_table_schema",
      args: {
        tableName: "users",
      },
      confirmed: true,
      runAt: "2023-12-29T07:37:37.370Z",
      output:
        '"[{\\"table\\":\\"users\\",\\"column\\":\\"user_id\\",\\"nullable\\":false,\\"dataType\\":\\"int\\",\\"columnnType\\":\\"int\\",\\"columnKey\\":\\"PRI\\",\\"extra\\":\\"auto_increment\\"},{\\"table\\":\\"users\\",\\"column\\":\\"first_name\\",\\"nullable\\":false,\\"dataType\\":\\"varchar\\",\\"columnnType\\":\\"varchar(50)\\",\\"columnKey\\":\\"\\",\\"extra\\":\\"\\"},{\\"table\\":\\"users\\",\\"column\\":\\"last_name\\",\\"nullable\\":false,\\"dataType\\":\\"varchar\\",\\"columnnType\\":\\"varchar(50)\\",\\"columnKey\\":\\"\\",\\"extra\\":\\"\\"},{\\"table\\":\\"users\\",\\"column\\":\\"date_of_birth\\",\\"nullable\\":true,\\"dataType\\":\\"date\\",\\"columnnType\\":\\"date\\",\\"columnKey\\":\\"\\",\\"extra\\":\\"\\"},{\\"table\\":\\"users\\",\\"column\\":\\"email\\",\\"nullable\\":false,\\"dataType\\":\\"varchar\\",\\"columnnType\\":\\"varchar(50)\\",\\"columnKey\\":\\"UNI\\",\\"extra\\":\\"\\"},{\\"table\\":\\"users\\",\\"column\\":\\"password\\",\\"nullable\\":false,\\"dataType\\":\\"varchar\\",\\"columnnType\\":\\"varchar(500)\\",\\"columnKey\\":\\"\\",\\"extra\\":\\"\\"},{\\"table\\":\\"users\\",\\"column\\":\\"address\\",\\"nullable\\":true,\\"dataType\\":\\"varchar\\",\\"columnnType\\":\\"varchar(50)\\",\\"columnKey\\":\\"\\",\\"extra\\":\\"\\"},{\\"table\\":\\"users\\",\\"column\\":\\"address_line_1\\",\\"nullable\\":true,\\"dataType\\":\\"varchar\\",\\"columnnType\\":\\"varchar(250)\\",\\"columnKey\\":\\"\\",\\"extra\\":\\"\\"},{\\"table\\":\\"users\\",\\"column\\":\\"address_line_2\\",\\"nullable\\":true,\\"dataType\\":\\"varchar\\",\\"columnnType\\":\\"varchar(250)\\",\\"columnKey\\":\\"\\",\\"extra\\":\\"\\"},{\\"table\\":\\"users\\",\\"column\\":\\"postcode\\",\\"nullable\\":true,\\"dataType\\":\\"varchar\\",\\"columnnType\\":\\"varchar(10)\\",\\"columnKey\\":\\"\\",\\"extra\\":\\"\\"},{\\"table\\":\\"users\\",\\"column\\":\\"city\\",\\"nullable\\":true,\\"dataType\\":\\"varchar\\",\\"columnnType\\":\\"varchar(20)\\",\\"columnKey\\":\\"\\",\\"extra\\":\\"\\"},{\\"table\\":\\"users\\",\\"column\\":\\"town\\",\\"nullable\\":true,\\"dataType\\":\\"varchar\\",\\"columnnType\\":\\"varchar(20)\\",\\"columnKey\\":\\"\\",\\"extra\\":\\"\\"},{\\"table\\":\\"users\\",\\"column\\":\\"state\\",\\"nullable\\":true,\\"dataType\\":\\"varchar\\",\\"columnnType\\":\\"varchar(20)\\",\\"columnKey\\":\\"\\",\\"extra\\":\\"\\"},{\\"table\\":\\"users\\",\\"column\\":\\"country\\",\\"nullable\\":true,\\"dataType\\":\\"varchar\\",\\"columnnType\\":\\"varchar(20)\\",\\"columnKey\\":\\"\\",\\"extra\\":\\"\\"},{\\"table\\":\\"users\\",\\"column\\":\\"phone_number\\",\\"nullable\\":false,\\"dataType\\":\\"varchar\\",\\"columnnType\\":\\"varchar(20)\\",\\"columnKey\\":\\"\\",\\"extra\\":\\"\\"},{\\"table\\":\\"users\\",\\"column\\":\\"emergency_contact_name\\",\\"nullable\\":true,\\"dataType\\":\\"varchar\\",\\"columnnType\\":\\"varchar(50)\\",\\"columnKey\\":\\"\\",\\"extra\\":\\"\\"},{\\"table\\":\\"users\\",\\"column\\":\\"contact_number\\",\\"nullable\\":true,\\"dataType\\":\\"varchar\\",\\"columnnType\\":\\"varchar(50)\\",\\"columnKey\\":\\"\\",\\"extra\\":\\"\\"},{\\"table\\":\\"users\\",\\"column\\":\\"user_type_id\\",\\"nullable\\":false,\\"dataType\\":\\"int\\",\\"columnnType\\":\\"int\\",\\"columnKey\\":\\"MUL\\",\\"extra\\":\\"\\",\\"foreignKeyTo\\":{\\"targetTable\\":\\"user_types\\",\\"targetColumn\\":\\"user_type_id\\"}},{\\"table\\":\\"users\\",\\"column\\":\\"github_profile\\",\\"nullable\\":true,\\"dataType\\":\\"varchar\\",\\"columnnType\\":\\"varchar(50)\\",\\"columnKey\\":\\"\\",\\"extra\\":\\"\\"},{\\"table\\":\\"users\\",\\"column\\":\\"codewars_profile\\",\\"nullable\\":true,\\"dataType\\":\\"varchar\\",\\"columnnType\\":\\"varchar(50)\\",\\"columnKey\\":\\"\\",\\"extra\\":\\"\\"}]"',
    },
  },
  {
    unuseful: false,
    hiddenFromUser: true,
    role: "user",
    message:
      "Consider the output of the get_table_schema. Does this give you enough information to answer my query? Think step by step. Run tools if necessary, using the previous information collected where applicable.",
  },
  {
    message:
      "Yes, the output of the `get_table_schema` function provides the details of the `users` table, including the existing columns and their data types. Now, I can proceed to create a new migration script to add the `created_at` and `updated_at` columns to the `users` table.\n\nI will now create the migration script to add the `created_at` and `updated_at` columns to the `users` table.\nHere's the migration script to add the `created_at` and `updated_at` columns to the `users` table:\n\n```javascript\n// migration_script.js\n\n// Add created_at and updated_at columns to the users table\nexports.up = function(knex) {\n  return knex.schema.alterTable('users', function(table) {\n    table.timestamp('created_at').defaultTo(knex.fn.now());\n    table.timestamp('updated_at').defaultTo(knex.fn.now());\n  });\n};\n\n// Remove created_at and updated_at",
    role: "assistant",
    unuseful: false,
    hiddenFromUser: false,
  },
  {
    unuseful: false,
    hiddenFromUser: false,
    role: "user",
    message: "Can you write it using MySQL statements?",
  },
  {
    message:
      "Certainly! Here's the MySQL migration script to add the `created_at` and `updated_at` columns to the `users` table:\n\n```sql\n-- migration_script.sql\n\n-- Add created_at and updated_at columns to the users table\nALTER TABLE users\nADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,\nADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;\n```\n\nYou can execute this SQL script as a migration to add the `created_at` and `updated_at` columns to the `users` table in your MySQL database.",
    role: "assistant",
    unuseful: false,
    hiddenFromUser: false,
  },
];
*/

const renderMessageCard = (
  message: any,
  messages: any,
  setMessages: any,
  postSessionMessage: any
) => {
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
                      const lastMessage = messages[messages.length - 1];
                      lastMessage.tool.confirmed = true;
                      const newMessages = [...messages];
                      setMessages(newMessages);
                      postSessionMessage(newMessages).then((data: any) => {
                        if (data.messages) {
                          setMessages(data.messages);
                        }
                      });
                    }}
                  >
                    Accept and run tool
                  </Button>
                  <Button
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => {
                      const lastMessage = messages[messages.length - 1];
                      lastMessage.tool.confirmed = false;
                      const newMessages = [...messages];
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
