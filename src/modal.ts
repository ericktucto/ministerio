import type { InjectionKey } from 'vue'
export type ModalError = {
  error: string[];
};
export type InjectModal = {
  resolveModal: <T = any>(data: T) => void;
  getModal: <T = any>(modal: string) => Promise<T | ModalError>;
};
export const modalKey: InjectionKey<InjectModal> = Symbol('modal')

