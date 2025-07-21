import type { InjectionKey } from 'vue'
export type ModalError = {
  error: string[];
};
export type DataModalType = {
  [string: string]: any
};
export type InjectModal = {
  resolveModal: <T = any>(data: T) => void;
  getModal: <T = any>(modal: string, data: any) => Promise<T | ModalError>;
  getData: <T = any>(modal: string) => T | null;
};
export const modalKey: InjectionKey<InjectModal> = Symbol('modal')

