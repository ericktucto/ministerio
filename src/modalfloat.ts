import { ref, type InjectionKey } from 'vue'

let _resolve: ((data: any) => void) | null = null;
export const idModal = ref('')
export const active = ref(false);
export const dataModal = ref<DataModalType>({});

export function getData<T = any>(modal: string): T {
  return dataModal.value[modal] || null;
}
export function resolveModal<T = any>(data: T) {
  active.value = false;
  _resolve?.(data);
  _resolve = null;
}
export function onCloseModal() {
  _resolve?.({ error: ['User close modal'] });
  _resolve = null;
  active.value = false;
}
export function getModal<T = any>(modal: string, data: any): Promise<T> {
  return new Promise<T>((resolve) => {
    active.value = true;
    idModal.value = modal;
    dataModal.value[modal] = data;
    _resolve = resolve;
  });
}
export const config = {
  resolveModal,
  getModal,
  getData,
};
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
export const modalKey: InjectionKey<InjectModal> = Symbol('modalfloat')

