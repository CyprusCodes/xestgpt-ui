import React from "react";
import { Modal, Button, Table, Typography, Tooltip, Tag } from "antd";
import {
  GlobalOutlined,
  CloudServerOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { FunctionType, ToolData } from "../../types";
import getBrowserName from "./getBrowserName";

interface ToolInformationModalProps {
  toolData?: ToolData;
  visible: boolean;
  onClose: () => void;
}

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    render: (name: string) => <Tag style={{ fontSize: "14px" }}>{name}</Tag>,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Required",
    dataIndex: "required",
    key: "required",
    render: (required: boolean) => (required ? "Yes" : "No"),
  },
  {
    title: "Default",
    dataIndex: "default",
    key: "default",
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
  },
];

const ToolInformationModal: React.FC<ToolInformationModalProps> = ({
  toolData,
  visible,
  onClose,
}) => {
  if (!toolData) {
    return null;
  }

  const {
    name,
    description,
    arguments: toolArguments,
    functionType,
    dangerous,
  } = toolData;

  const dataSource = Object.entries(toolArguments.properties).map(
    ([argName, argDetails]) => ({
      key: argName,
      name: argName,
      type: argDetails.type,
      required:
        toolArguments.required && toolArguments.required.includes(argName),
      default: JSON.stringify(toolArguments.default[argName]) || "",
      description: argDetails.description,
    })
  );

  return (
    <Modal
      title={
        <span>
          {name}{" "}
          {dangerous && (
            <Tooltip title="This tool has elevated access rights to your data sources. It can update, or delete your data.">
              <ExclamationCircleOutlined style={{ color: "orange" }} />
            </Tooltip>
          )}
        </span>
      }
      open={visible}
      onCancel={onClose}
      width="800px"
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <Typography.Paragraph>{description}</Typography.Paragraph>

      {functionType === FunctionType.BACKEND ? (
        <Typography.Paragraph>
          This tool runs on your{" "}
          <Tag icon={<CloudServerOutlined />} color="success">
            Cloud Servers{" "}
          </Tag>
        </Typography.Paragraph>
      ) : (
        <Typography.Paragraph>
          This tool runs on your{" "}
          <Tag icon={<GlobalOutlined />} color="success">
            {getBrowserName()} Browser{" "}
          </Tag>
        </Typography.Paragraph>
      )}

      {dataSource.length > 0 && (
        <>
          <Typography.Title level={5}>Arguments List</Typography.Title>
          <Table dataSource={dataSource} columns={columns} pagination={false} />
        </>
      )}
    </Modal>
  );
};

export default ToolInformationModal;
