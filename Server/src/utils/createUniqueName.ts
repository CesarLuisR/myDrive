import { v4 as uuidv4 } from 'uuid';

export const createUniqueFileName = (userId: string, fileName: string) => {
    const key = `${userId}/${uuidv4()}/${fileName}`;
    return key;
}