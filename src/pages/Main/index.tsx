import { useState, useEffect, FormEvent } from 'react';
import { omit } from 'remeda';
import { processWord } from '../../helpers';
import { trpc } from '../../trpc/client';
import { WordType } from '../../server/schema';

export function Main() {
    const [username, setUsername] = useState('');
    const [words, setWords] = useState<Record<string, WordType>>({});

    const fetchWords = async () => {
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

        setWords(wordsMap);
    };

    const addWord = (
        word: Omit<
            WordType,
            'username' | 'isDeleted' | 'createdAt' | 'updatedAt'
        >,
    ) => {
        const newWord = {
            value: processWord(word.value),
            username: username,
            isDeleted: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        };

        setWords((prev) => ({
            ...prev,
            [word.value]: newWord,
        }));

        trpc.addWord.mutate({
            username: username,
            word: word.value,
        });
    };

    const removeWord = (wordValue: string) => {
        setWords((prev) => omit(prev, [wordValue]));
    };

    const updateWord = (word: WordType) => {
        setWords((prev) => ({ ...prev, [word.value]: word }));
    };

    useEffect(() => {
        console.log(words);
    }, [words]);

    useEffect(() => {
        fetchWords();
    }, [username]);

    return (
        <div className="flex h-screen flex-col p-2">
            <div className="flex flex-row-reverse">
                <form action="/logout" method="post">
                    <button
                        type="submit"
                        className="p-1 bg-blue-500 text-white"
                    >
                        logout
                    </button>
                </form>
            </div>
            <hr className="my-2" />
            <div className="grow overflow-auto">
                <div className="flex flex-col gap-2">
                    {Object.values(words)
                        .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
                        .map((word) => (
                            <div
                                key={word.value}
                                className="flex flex-row gap-2"
                            >
                                <button
                                    type="button"
                                    className="p-1 bg-red-950 text-white"
                                    onClick={() => {
                                        removeWord(word.value);
                                    }}
                                >
                                    delete
                                </button>
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
                <button
                    type="submit"
                    className="p-1 bg-blue-500 text-white min-w-16"
                >
                    add
                </button>
            </form>
        </div>
    );
}
