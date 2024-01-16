import React from "react";
import { Form, Input, Button } from "antd";
import { UIFunctionArguments } from "../../types";

interface InputFieldArgs {
  label: string;
}

const InputField: React.FC<UIFunctionArguments<InputFieldArgs>> = ({
  functionArgs: { label },
  previousRunResults, // if non-empty, you should render a READ ONLY
  captureResults, // should only be called ONCE
}) => {
  const onFinish = (values: any) => {
    captureResults(`Email submitted: ${values.email}`);
  };

  if (previousRunResults) {
    return <div>{previousRunResults}</div>;
  }

  return (
    <Form onFinish={onFinish} layout="vertical">
      <Form.Item
        label={label}
        name="email"
        rules={[
          {
            type: "email",
            message: "Please enter a valid email address",
          },
          {
            required: true,
            message: "Please enter your email",
          },
        ]}
      >
        <Input placeholder="Enter your email" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default InputField;
