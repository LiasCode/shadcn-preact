import type { RefObject } from "preact";
import { useRef, useState } from "preact/hooks";

import {
  createGenericEventDetails,
  type BaseUIGenericEventDetails,
} from "../internals/createBaseUIEventDetails";
import { FormContext, type RegisteredField, type ValidationMode } from "../internals/FormContext";
import type { BaseUIComponentProps } from "../internals/types";
import { useIsoLayoutEffect } from "../internals/useIsoLayoutEffect";
import { useRenderElement } from "../internals/useRenderElement";
import { useStableCallback } from "../internals/useStableCallback";

export interface FormProps<
  Values extends Record<string, any> = Record<string, any>,
> extends BaseUIComponentProps<"form", {}> {
  validationMode?: ValidationMode;
  errors?: Record<string, string | string[]>;
  actionsRef?: RefObject<Form.Actions | null>;
  onFormSubmit?: (values: Values, details: BaseUIGenericEventDetails<"none">) => void;
}

export function Form<Values extends Record<string, any> = Record<string, any>>(
  props: FormProps<Values>,
) {
  const {
    ref,
    validationMode = "onSubmit",
    errors: errorsProp,
    actionsRef,
    onFormSubmit,
    onSubmit,
    render: _render,
    className: _className,
    style: _style,
    ...elementProps
  } = props;
  const fields = useRef(new Map<symbol, RegisteredField>()).current;
  const submitted = useRef(false);
  const [errors, setErrors] = useState(errorsProp ?? {});
  const previousErrors = useRef(errorsProp);
  useIsoLayoutEffect(() => {
    if (previousErrors.current !== errorsProp) {
      previousErrors.current = errorsProp;
      setErrors(errorsProp ?? {});
    }
  }, [errorsProp]);
  const clearError = useStableCallback((name: string) =>
    setErrors((previous) => {
      if (!Object.hasOwn(previous, name)) {
        return previous;
      }

      const next = { ...previous };
      delete next[name];
      return next;
    }),
  );
  const validate = useStableCallback((name?: string) => {
    for (const field of fields.values()) {
      if (name === undefined || field.name === name) {
        field.validate();
      }
    }
  });
  useIsoLayoutEffect(() => {
    if (!actionsRef) {
      return;
    }

    actionsRef.current = { validate };
    return () => {
      actionsRef.current = null;
    };
  }, [actionsRef, validate]);

  useIsoLayoutEffect(() => {
    if (!submitted.current) {
      return;
    }

    for (const field of fields.values()) {
      if (field.isInvalid()) {
        field.focus();
        break;
      }
    }
  }, [errors, fields]);
  const element = useRenderElement("form", props, {
    ref,
    state: {},
    props: [
      {
        noValidate: true,
        onSubmit(event: SubmitEvent) {
          submitted.current = true;
          validate();

          for (const field of fields.values()) {
            if (field.isInvalid()) {
              event.preventDefault();

              field.focus();
              return;
            }
          }

          onSubmit?.(event as never);

          if (onFormSubmit) {
            event.preventDefault();
            const values: Record<string, any> = {};

            for (const field of fields.values()) {
              if (field.name) {
                values[field.name] = field.getValue();
              }
            }

            onFormSubmit(values as Values, createGenericEventDetails("none", event));
          }
        },
      },
      elementProps,
    ],
  });
  return (
    <FormContext.Provider value={{ fields, submitted, validationMode, errors, clearError }}>
      {element}
    </FormContext.Provider>
  );
}

export declare namespace Form {
  type Actions = { validate: (fieldName?: string) => void };

  type Props<Values extends Record<string, any> = Record<string, any>> = FormProps<Values>;

  type State = {};

  type ValidationMode = import("../internals/FormContext").ValidationMode;

  type Values<Values extends Record<string, any> = Record<string, any>> = Values;

  type SubmitEventReason = "none";

  type SubmitEventDetails = BaseUIGenericEventDetails<"none">;
}
