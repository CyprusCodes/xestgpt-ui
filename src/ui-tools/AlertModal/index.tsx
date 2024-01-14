import React, { useState } from "react";
import { Modal } from "antd";
import { UIFunctionArguments } from "../../types";

interface ModalArgs {
  message: string;
}

const AlertModal: React.FC<UIFunctionArguments<ModalArgs>> = ({
  functionArgs: { message },
  previousRunResults,
  captureResults,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(true);

  const handleOk = () => {
    console.log("Modal is closed");
    captureResults("User closed the modal by clicking Ok button.");
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    console.log("Modal is closed");
    captureResults("User closed the modal by clicking Cancel button.");
    setIsModalVisible(false);
  };

  return (
    <Modal
      title="Basic Modal"
      open={isModalVisible}
      onOk={handleOk}
      onCancel={handleCancel}
    >
      <p>AI: {message}</p>
      <p>User: {previousRunResults}</p>
    </Modal>
  );
};

export default AlertModal;
