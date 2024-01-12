import React from 'react';
import { Modal, Button, Descriptions } from 'antd';
import { ToolData } from '../../types';

interface ToolInformationModalProps {
  toolData: ToolData;
  visible: boolean;
  onClose: () => void;
}

const ToolInformationModal: React.FC<ToolInformationModalProps> = ({ toolData, visible, onClose }) => {
  const { name, description, arguments: toolArguments } = toolData;

  return (
    <Modal
      title={name}
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="close" onClick={onClose}>
          Close
        </Button>,
      ]}
    >
      <Descriptions title="Tool Information" bordered>
        <Descriptions.Item label="Description">{description}</Descriptions.Item>
        <Descriptions.Item label="Arguments" span={2}>
          {Object.keys(toolArguments.properties || {}).map((argName) => (
            <div key={argName}>
              <strong>{argName}:</strong> {toolArguments.properties[argName].type}
              <br />
              <small>{toolArguments.properties[argName].description}</small>
              {toolArguments.required && toolArguments.required.includes(argName) ? (
                <span style={{ marginLeft: '8px', color: 'red' }}>(Required)</span>
              ) : (
                <span style={{ marginLeft: '8px', color: 'green' }}>(Optional)</span>
              )}
            </div>
          ))}
        </Descriptions.Item>
      </Descriptions>
    </Modal>
  );
};

export default ToolInformationModal;
