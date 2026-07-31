import React, { useEffect } from "react";
import type { Attempt, Entry, GameState } from "./types/game";
import { toast } from "react-toastify";

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
        if (state.isFinsihed) return state;
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

        let newPosition = state.position;

        if (state.position.col < 5) {
            newPosition = { ...state.position, col: state.position.col + 1 };
        }

        return {
            ...state,
            attempts: newAttempts,
            position: newPosition,
        } as GameState;
    });
};

const popEntry = (
    updateState: React.Dispatch<React.SetStateAction<GameState>>,
) => {
    updateState((state: GameState) => {
        if (state.isFinsihed) return state;
        if (state.position.col < 1) return state;
        const newAttempts = state.attempts.map((att, rdx) => {
            if (rdx !== state.position.row) return att;
            return {
                attempt: att.attempt.map((e, cdx) => {
                    if (cdx !== state.position.col - 1) return e;
                    return { value: "", state: "INACTIVE" } as Entry;
                }),
            };
        });
        return {
            ...state,
            position: { ...state.position, col: state.position.col - 1 },
            attempts: newAttempts,
        };
    });
};

const checkAttempt = async (
    state: GameState,
    updateState: React.Dispatch<React.SetStateAction<GameState>>,
) => {
    if (state.isFinsihed) return;
    if (state.position.col !== 5) return;

    const row = state.position.row;
    const target = state.word;
    const attemptArr = state.attempts[row].attempt;
    const word = attemptArr.map((e) => e.value).join("");

    if (!(await checkWordExists(word))) {
        toast.error("Not A Word", { position: "top-center" });
        return;
    }

    const result: Entry[] = new Array(5);
    const targetCount: Record<string, number> = {};

    for (let ch of target) {
        targetCount[ch] = (targetCount[ch] || 0) + 1;
    }

    for (let i = 0; i < 5; i++) {
        const val = attemptArr[i].value;

        if (val === target[i]) {
            result[i] = { ...attemptArr[i], state: "RIGHT_IN_PLACE" };
            targetCount[val]--;
        }
    }

    for (let i = 0; i < 5; i++) {
        if (result[i]) continue;

        const val = attemptArr[i].value;

        if (targetCount[val] > 0) {
            result[i] = { ...attemptArr[i], state: "RIGHT_OFF_PLACE" };
            targetCount[val]--;
        } else {
            result[i] = { ...attemptArr[i], state: "WRONG" };
        }
    }

    const newAttempts = state.attempts.map((att, idx) =>
        idx === row ? { attempt: result } : att,
    );

    const isWin = word === target;

    const isLastRow = row === state.attempts.length - 1;
    const isLose = !isWin && isLastRow;

    if (isWin) {
        toast.success("You Win!", { position: "top-center" });
    } else if (isLose) {
        toast.error(`You Lose! Word was ${target}`, { position: "top-center" });
    }

    updateState({
        ...state,
        attempts: newAttempts,
        isFinsihed: isWin || isLose,
        position: isWin || isLose ? state.position : { row: row + 1, col: 0 },
        won: isWin,
    });
};

export {
    getRandomWord,
    checkWordExists,
    useWordleInput,
    appendEntry,
    popEntry,
    checkAttempt,
};
