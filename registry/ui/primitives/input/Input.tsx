import { FieldControl } from "../field/control/FieldControl";
export interface InputProps extends FieldControl.Props {}
export interface InputState extends FieldControl.State {}
export function Input(props: InputProps) {
  return <FieldControl {...props} />;
}
export declare namespace Input {
  type Props = InputProps;
  type State = InputState;
  type ChangeEventReason = FieldControl.ChangeEventReason;
  type ChangeEventDetails = FieldControl.ChangeEventDetails;
}