import { CSSObject } from '@emotion/react';

export const createStyles = <T extends Record<string, CSSObject>>(styles: T) => styles;
