import {formFields} from './data';
import {ProfileInfo} from './data';

export const personal = formFields.slice(0, 6);
export const contact = formFields.slice(6, 12);
export const qualification=formFields.slice(12,17);
export const professional=formFields.slice(17,21);

export const firstStep = ProfileInfo.slice(0, 5);
export const secondStep = ProfileInfo.slice(5, 14);
export const thirdStep = ProfileInfo.slice(14, 18);
