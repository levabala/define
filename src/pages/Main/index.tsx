import { effect, signal } from '@preact/signals';
import { omit } from 'remeda';
import { processWord } from '../../helpers';
import { trpc } from '../../trpc/client';
import { WordType } from '@/server/schema';
import { useEffect } from 'preact/hooks';

function createUserState() {
    const username = signal('');

    return { username };
}

const userState = createUserState();

function createDictionaryState() {
    const words = signal<Record<string, WordType>>({});

    async function fetchWords() {
        const res = await trpc.getWordsAll.query({
            username: userState.username.value,
        });

        words.value = res.reduce(
            (acc, word) => {
                acc[word.value] = word;

                return acc;
            },
            {} as Record<string, WordType>,
        );
    }

    function addWord(
        word: Omit<
            WordType,
            'username' | 'isDeleted' | 'createdAt' | 'updatedAt'
        >,
    ) {
        words.value = {
            ...words.value,
            [word.value]: {
                value: processWord(word.value),
                username: userState.username.value,
                isDeleted: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            },
        };

        trpc.addWord.mutate({
            username: userState.username.value,
            word: word.value,
        });
    }

    function removeWord(wordValue: string) {
        words.value = omit(words.value, [wordValue]);
    }

    function updateWord(word: WordType) {
        words.value = { ...words.value, [word.value]: word };
    }

    effect(() => {
        console.log(words.value);
    });

    return { words, addWord, removeWord, updateWord, fetchWords };
}

const dictionaryState = createDictionaryState();

export function Main() {
    useEffect(() => {
        dictionaryState.fetchWords();
    }, []);

    return (
        <div class="flex h-screen flex-col p-2">
            <div class="flex flex-row-reverse">
                <form action="/logout" method="post">
                    <button type="submit" class="p-1 bg-blue-500 text-white">
                        logout
                    </button>
                </form>
            </div>
            <hr class="my-2" />
            <div class="grow overflow-auto">
                <div class="flex flex-col gap-2">
                    {Object.values(dictionaryState.words.value)
                        .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
                        .map((word) => (
                            <div class="flex flex-row gap-2">
                                <button
                                    type="button"
                                    class="p-1 bg-red-950 text-white"
                                    onClick={() => {
                                        dictionaryState.removeWord(word.value);
                                    }}
                                >
                                    delete
                                </button>
                                <div class="grow">{word.value}</div>
                            </div>
                        ))}
                </div>
            </div>
            <hr class="my-2" />
            <form
                class="flex flex-row gap-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);

                    const word = formData.get('word');

                    if (!word) {
                        console.error('No word provided');
                        return;
                    }

                    dictionaryState.addWord({
                        value: word.toString(),
                    });

                    e.currentTarget.reset();
                }}
            >
                <input
                    name="word"
                    type="text"
                    placeholder="add a word"
                    class="border-solid border-1 border-gray-200 p-1 w-full"
                />
                <button
                    type="submit"
                    class="p-1 bg-blue-500 text-white min-w-16"
                >
                    add
                </button>
            </form>
        </div>
    );
}
