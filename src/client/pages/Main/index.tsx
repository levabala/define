import { Button } from '@/client/components/ui/button';
import { Input } from '@/client/components/ui/input';
import { usernameAtom } from '@/client/stores/user';
import {
    addWordAtom,
    currentWordAtom,
    currentWordValueAtom,
    fetchWordsAtom,
    removeWordAtom,
    sortedWordsAtom,
    wordsAtom,
} from '@/client/stores/words';
import { useAtom, useSetAtom } from 'jotai';
import { FormEvent, useEffect } from 'react';

export function Main() {
    const [username] = useAtom(usernameAtom);
    const [words] = useAtom(wordsAtom);
    const [wordCurrent] = useAtom(currentWordAtom);
    const [_wordCurrentValue, setWordCurrentValue] =
        useAtom(currentWordValueAtom);
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
        <div className="flex h-full flex-col">
            <div className="flex flex-row-reverse">
                <form action="/logout" method="post">
                    <Button type="submit" variant="default" size="sm">
                        logout
                    </Button>
                </form>
            </div>
            <hr className="my-2" />
            <div className="flex grow flex-row gap-2">
                {wordCurrent ? wordCurrent.value : 'null'}
            </div>
            <hr className="my-2" />
            <div className="h-40 overflow-auto">
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
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => {
                                    setWordCurrentValue(word.value);
                                }}
                            >
                                select
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
                <Input name="word" type="text" placeholder="add a word" />
                <Button
                    type="submit"
                    variant="default"
                    size="sm"
                    className="h-full"
                >
                    add
                </Button>
            </form>
        </div>
    );
}
