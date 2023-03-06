import { atom } from 'recoil';

export type ModalKey = 0 | 1;
export const modalState = atom<ModalKey | undefined>({ default: undefined, key: 'modal' });
