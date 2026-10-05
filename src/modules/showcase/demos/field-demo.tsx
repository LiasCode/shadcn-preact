import { FieldBlurValidation } from "../examples/field-blur-validation";
import { FieldCompositeValidation } from "../examples/field-composite-validation";
import { FieldFieldset as Example1 } from "../examples/field-fieldset";
import Example2 from "../examples/field-input";
import { FieldItemScopes } from "../examples/field-item-scopes";
import { FieldResponsive as Example3 } from "../examples/field-responsive";
import { FieldSelectionValidation } from "../examples/field-selection-validation";
import Example4 from "../examples/field-textarea";
import { FieldValidation } from "../examples/field-validation";

export function FieldDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-8">
      <Example1 />
      <Example2 />
      <Example3 />
      <Example4 />
      <FieldValidation />
      <FieldBlurValidation />
      <FieldSelectionValidation />
      <FieldCompositeValidation />
      <FieldItemScopes />
    </div>
  );
}
