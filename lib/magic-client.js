import { Magic } from 'magic-sdk';

const initMagic = () => {
    return (typeof window !== "undefined" && new Magic(process.env.NEXT_PUBLIC_MAGIC_PUBLIC_KEY))
};

export const magic = initMagic();