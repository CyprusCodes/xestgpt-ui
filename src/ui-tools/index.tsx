import React from "react";
import { UIFunctionArguments } from "../types";
import AlertModal from "./AlertModal";

const UITools: Record<string, React.FC<UIFunctionArguments<any>>> = {
  show_alert_modal: AlertModal,
};

const UIToolComponent = ({
  functionName,
  functionArgs,
  previousRunResults,
  captureResults,
}: {
  functionName: string;
  functionArgs: any;
  previousRunResults?: string;
  captureResults: (result: string) => void;
}) => {
  const Component = UITools[functionName];

  if (!Component) {
    throw new Error(
      `Tried to render non-existing UI-Tool component for ${functionName}.`
    );
  }

  return (
    <Component
      functionArgs={functionArgs}
      previousRunResults={previousRunResults}
      captureResults={captureResults}
    />
  );
};

export default UIToolComponent;
