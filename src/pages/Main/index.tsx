import { Button } from '@/components/ui/button';
import { COOKIE_NAME_USERNAME } from '@/consts';
import { WordType } from '@/server/schema';
import { atom, useAtom, useSetAtom } from 'jotai';
import Cookies from 'js-cookie';
import { FormEvent, useEffect } from 'react';
import { omit } from 'remeda';
import { processWord } from '../../helpers';
import { trpc } from '../../trpc/client';

const usernameAtom = atom(Cookies.get(COOKIE_NAME_USERNAME) || '');
const wordsAtom = atom<Record<string, WordType>>({});

const fetchWordsAtom = atom(null, async (get, set) => {
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

const addWordAtom = atom(
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

const removeWordAtom = atom(null, (_get, set, wordValue: string) => {
    set(wordsAtom, (prev) => omit(prev, [wordValue]));
});

const sortedWordsAtom = atom((get) => {
    const words = get(wordsAtom);
    return Object.values(words).sort((a, b) =>
        a.createdAt > b.createdAt ? 1 : -1,
    );
});

export function Main() {
    const [username] = useAtom(usernameAtom);
    const [words] = useAtom(wordsAtom);
    const sortedWords = useAtom(sortedWordsAtom)[0];

    const fetchWords = useSetAtom(fetchWordsAtom);
    const addWord = useSetAtom(addWordAtom);
    const removeWord = useSetAtom(removeWordAtom);

    useEffect(() => {
        console.log(words);
    }, [words]);

    useEffect(() => {
        fetchWords();
    }, [username, fetchWords]);

    return (
        <div className="flex h-screen flex-col p-2">
            <div className="flex flex-row-reverse">
                <form action="/logout" method="post">
                    <Button type="submit" variant="default" size="sm">
                        logout
                    </Button>
                </form>
            </div>
            <hr className="my-2" />
            <div className="grow overflow-auto">
                <div className="flex flex-col gap-2">
                    {sortedWords.map((word) => (
                        <div key={word.value} className="flex flex-row gap-2">
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                    removeWord(word.value);
                                }}
                            >
                                delete
                            </Button>
                            <div className="grow">{word.value}</div>
                        </div>
                    ))}
                </div>
            </div>
            <hr className="my-2" />
            <form
                className="flex flex-row gap-2"
                onSubmit={(e: FormEvent<HTMLFormElement>) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);

                    const word = formData.get('word');

                    if (!word) {
                        console.error('No word provided');
                        return;
                    }

                    addWord({
                        value: word.toString(),
                    });

                    e.currentTarget.reset();
                }}
            >
                <input
                    name="word"
                    type="text"
                    placeholder="add a word"
                    className="border-solid border-1 border-gray-200 p-1 w-full"
                />
                <Button type="submit" variant="default" size="sm">
                    add
                </Button>
            </form>
        </div>
    );
}
