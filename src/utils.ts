import { useEffect } from "react";
import type { Attempt, Entry, GameState } from "./types/game";

const getRandomWord = async (): Promise<string> => {
    const res = await (await fetch("/src/data/main_words.txt")).text();
    const words = res
        .split("\n")
        .map((word) => word.trim())
        .filter(Boolean);
    const randomIdx = Math.floor(Math.random() * words.length);

    return words[randomIdx];
};

const checkWordExists = async (word: string): Promise<boolean> => {
    const res = await (await fetch("/src/data/all_words.txt")).text();
    const words = res
        .split("\n")
        .map((word) => word.trim())
        .filter(Boolean);

    return words.includes(word);
};

const useWordleInput = (onKey: (key: string) => void) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const key = e.key;

            if (key === "Enter" || key === "Backspace") {
                onKey(key);
                return;
            }

            if (/^[a-zA-Z]$/.test(key)) {
                onKey(key.toLowerCase());
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
};

const appendEntry = (
    val: string,
    updateState: React.Dispatch<React.SetStateAction<GameState>>,
) => {
    updateState((state: GameState) => {
        const newAttempts = state.attempts.map((att: Attempt, rdx: number) => {
            if (rdx != state.position.row) return att;
            return {
                ...att,
                attempt: att.attempt.map((e, cdx) => {
                    return (
                        cdx === state.position.col
                            ? { value: val, state: "INACTIVE" }
                            : e
                    ) as Entry;
                }),
            };
        });

        const newPosition = {
            ...state.position,
            col: state.position.col + 1,
        };

        return {
            ...state,
            attempts: newAttempts,
            position: newPosition,
        } as GameState;
    });
};

export { getRandomWord, checkWordExists, useWordleInput, appendEntry };
