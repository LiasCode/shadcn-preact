import type { ComponentChildren } from "preact";

import type { ComponentProps } from "./types";

export interface ToastObject<Data extends object = any> {
  id: string;
  title?: ComponentChildren;
  description?: ComponentChildren;
  type?: string;
  timeout?: number;
  priority?: "low" | "high";
  transitionStatus?: "starting" | "ending";
  updateKey?: number;
  limited?: boolean;
  height?: number;
  onClose?: () => void;
  onRemove?: () => void;
  actionProps?: ComponentProps<"button">;
  data?: Data;
}
export type AddOptions<D extends object = any> = Omit<ToastObject<D>, "id" | "height" | "limited" | "updateKey"> & {
  id?: string;
};
export type UpdateOptions<D extends object = any> = Partial<
  Omit<ToastObject<D>, "id" | "height" | "transitionStatus" | "limited" | "updateKey">
>;
type PromiseOption<V, D extends object> = string | UpdateOptions<D> | ((value: V) => string | UpdateOptions<D>);
export interface PromiseOptions<V, D extends object = any> {
  loading: string | UpdateOptions<D>;
  success: PromiseOption<V, D>;
  error: PromiseOption<any, D>;
}
export interface ToastManager<D extends object = any> {
  " subscribe": (listener: (event: ToastManagerEvent) => void) => () => void;
  add<T extends D = D>(options: AddOptions<T>): string;
  update<T extends D = D>(id: string, options: UpdateOptions<T>): void;
  close(id?: string): void;
  promise<V, T extends D = D>(value: Promise<V>, options: PromiseOptions<V, T>): Promise<V>;
}
export type ToastManagerEvent = { action: "add" | "update" | "close"; options: any };
let nextId = 0;
export function createToastManager<D extends object = any>(): ToastManager<D> {
  const listeners = new Set<(event: ToastManagerEvent) => void>();
  const emit = (event: ToastManagerEvent) => {
    for (const listener of listeners) listener(event);
  };
  const manager: ToastManager<D> = {
    " subscribe"(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    add(options) {
      const id = options.id ?? `toast-${++nextId}`;
      emit({ action: "add", options: { ...options, id } });
      return id;
    },
    update(id, options) {
      emit({ action: "update", options: { id, ...options } });
    },
    close(id) {
      emit({ action: "close", options: { id } });
    },
    async promise(value, options) {
      const resolve = (option: any, result?: any): UpdateOptions<D> => {
        const resolved = typeof option === "function" ? option(result) : option;
        return typeof resolved === "string" ? { title: resolved } : resolved;
      };
      const id = manager.add({ ...resolve(options.loading), type: "loading", timeout: 0 });
      try {
        const result = await value;
        manager.update(id, { type: "success", timeout: undefined, ...resolve(options.success, result) });
        return result;
      } catch (error) {
        manager.update(id, { type: "error", timeout: undefined, ...resolve(options.error, error) });
        throw error;
      }
    },
  };
  return manager;
}