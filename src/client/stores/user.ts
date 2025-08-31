import { COOKIE_NAME_USERNAME } from '@/consts';
import { atom } from 'jotai';
import Cookies from 'js-cookie';

export const usernameAtom = atom(Cookies.get(COOKIE_NAME_USERNAME) || '');
