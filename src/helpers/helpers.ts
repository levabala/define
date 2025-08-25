export function processWord(word: string) {
    return word.toLowerCase().trim().replace(/\s+/g, ' ');
}
