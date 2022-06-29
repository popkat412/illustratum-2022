import ECSComponent from "../EntityComponentSystem/Component";

export default class TooltipComponent extends ECSComponent {
  // these will be joined with newlines
  tooltipContent = "";
}
