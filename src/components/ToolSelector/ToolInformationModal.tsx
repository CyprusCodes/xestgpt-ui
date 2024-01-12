import React from "react";
import { Modal, Button, Table, Typography, Card } from "antd";
import { ToolData } from "../../types";

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

  const { name, description, arguments: toolArguments } = toolData;

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
      title={name}
      open={visible}
      onCancel={onClose}
      width="800px"
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <Card>
        <Typography.Paragraph>{description}</Typography.Paragraph>
        {dataSource.length > 0 && (
          <>
            <Typography.Title level={5}>Arguments List</Typography.Title>
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
            />
          </>
        )}
      </Card>
    </Modal>
  );
};

export default ToolInformationModal;
