import { UIFunctionArguments } from "../types";
import AlertModal from "./AlertModal";

const UITools: Record<string, React.FC<UIFunctionArguments<any>>> = {
    "show_alert_modal": AlertModal
}

export default UITools;