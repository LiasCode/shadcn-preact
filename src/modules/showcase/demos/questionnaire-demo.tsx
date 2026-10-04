import { NativeSelect, NativeSelectOption } from "@registry/ui/native-select";
import { useState } from "preact/hooks";

import { QuestionnaireAnimated as Example0 } from "../examples/questionnaire-animated";
import { QuestionnaireCard as Example1 } from "../examples/questionnaire-card";
import { QuestionnaireConditional as Example2 } from "../examples/questionnaire-conditional";
import { QuestionnaireControlled as Example3 } from "../examples/questionnaire-controlled";
import { QuestionnaireDemo as Example4 } from "../examples/questionnaire-demo";
import { QuestionnaireDialog as Example5 } from "../examples/questionnaire-dialog";
import { QuestionnaireFreeform as Example6 } from "../examples/questionnaire-freeform";
import { QuestionnaireMultiple as Example7 } from "../examples/questionnaire-multiple";
import { QuestionnaireNavigationState as Example8 } from "../examples/questionnaire-navigation-state";
import { QuestionnaireProgressExample as Example9 } from "../examples/questionnaire-progress";
import { QuestionnaireResume as Example10 } from "../examples/questionnaire-resume";
import { QuestionnaireShortcuts as Example11 } from "../examples/questionnaire-shortcuts";
import { QuestionnaireSkipExample as Example12 } from "../examples/questionnaire-skip";
import { QuestionnaireValidation as Example13 } from "../examples/questionnaire-validation";
const examples = [
  ["Animated", Example0],
  ["Card", Example1],
  ["Conditional", Example2],
  ["Controlled", Example3],
  ["Demo", Example4],
  ["Dialog", Example5],
  ["Freeform", Example6],
  ["Multiple", Example7],
  ["Navigation State", Example8],
  ["Progress", Example9],
  ["Resume", Example10],
  ["Shortcuts", Example11],
  ["Skip", Example12],
  ["Validation", Example13],
] as const;
export function QuestionnaireDemo() {
  const [selected, setSelected] = useState(4);
  const [, Example] = examples[selected]!;
  return (
    <div className="w-full min-w-0 space-y-4">
      <NativeSelect
        aria-label="Questionnaire example"
        value={String(selected)}
        onChange={(event) => setSelected(Number(event.currentTarget.value))}
      >
        {examples.map(([name], index) => (
          <NativeSelectOption key={name} value={String(index)}>
            {name}
          </NativeSelectOption>
        ))}
      </NativeSelect>
      <div className="relative w-full min-w-0">
        <Example key={selected} />
      </div>
    </div>
  );
}