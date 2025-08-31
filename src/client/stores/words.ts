import { processWord } from '@/helpers';
import { WordType } from '@/schema';
import { atom } from 'jotai';
import { omit } from 'remeda';
import { trpc } from '../trpc/client';
import { usernameAtom } from './user';

export const wordsAtom = atom<Record<string, WordType>>({});

export const fetchWordsAtom = atom(null, async (get, set) => {
    const username = get(usernameAtom);
    console.log({ username });
    if (!username) return;

    const res = await trpc.getWordsAll.query({
        username: username,
    });
    console.log({ res });

    const wordsMap = res.reduce(
        (acc, word) => {
            acc[word.value] = word;
            return acc;
        },
        {} as Record<string, WordType>,
    );

    set(wordsAtom, wordsMap);
});

export const addWordAtom = atom(
    null,
    (
        get,
        set,
        word: Omit<
            WordType,
            'username' | 'isDeleted' | 'createdAt' | 'updatedAt'
        >,
    ) => {
        const username = get(usernameAtom);

        const newWord = {
            value: processWord(word.value),
            username: username,
            isDeleted: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        set(wordsAtom, (prev) => ({
            ...prev,
            [word.value]: newWord,
        }));

        trpc.addWord.mutate({
            username: username,
            word: word.value,
        });
    },
);

export const removeWordAtom = atom(null, (get, set, wordValue: string) => {
    const username = get(usernameAtom);

    set(wordsAtom, (prev) => omit(prev, [wordValue]));

    trpc.deleteWord.mutate({
        username: username,
        word: wordValue,
    });
});

export const sortedWordsAtom = atom((get) => {
    const words = get(wordsAtom);
    return Object.values(words).sort((a, b) =>
        a.createdAt > b.createdAt ? 1 : -1,
    );
});
