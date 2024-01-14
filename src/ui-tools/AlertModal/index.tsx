import React, { useState } from "react";
import { Modal, Button } from "antd";
import { UIFunctionArguments } from "../../types";

interface ModalArgs {
  message: string;
}

const AlertModal: React.FC<UIFunctionArguments<ModalArgs>> = ({
  functionArgs: { message },
  previousRunResults,
  captureResults,
}) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

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
    <>
      <Button type="primary" onClick={showModal}>
        Open Modal
      </Button>
      <Modal
        title="Basic Modal"
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        {message}
      </Modal>
    </>
  );
};

export default AlertModal;
