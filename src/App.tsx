import { useEffect, useRef, useState } from "react";
import Board from "./components/board";
import type { GameState, Attempt, Entry, Position } from "./types/game";
import {
    appendEntry,
    checkAttempt,
    getRandomWord,
    popEntry,
    useWordleInput,
} from "./utils";
import { ToastContainer } from "react-toastify";
import Keyboard from "./components/keyboard";

const createInitialState = (): GameState => {
    return {
        attempts: Array.from({ length: 6 }, () => {
            return {
                attempt: Array.from(
                    { length: 5 },
                    () =>
                        ({
                            state: "INACTIVE",
                            value: "",
                        }) as Entry,
                ),
            } as Attempt;
        }),
        word: "",
        position: { row: 0, col: 0 } as Position,
        isFinsihed: false,
    };
};

export default function App() {
    const [gameState, setGameState] = useState<GameState>(() =>
        createInitialState(),
    );

    const stateRef = useRef<GameState>(gameState);

    useEffect(() => {
        stateRef.current = gameState;
    }, [gameState]);

    const handleKey = (key: string) => {
        if (key.toLowerCase() === "enter") {
            checkAttempt(stateRef.current, setGameState);
        } else if (key.toLowerCase() === "backspace") {
            popEntry(setGameState);
        } else {
            appendEntry(key, setGameState);
        }
    };

    useWordleInput(handleKey);

    useEffect(() => {
        (async () => {
            const word = await getRandomWord();
            setGameState((prev) => ({ ...prev, word: word }));
        })();
    }, []);

    return (
        <div className="main">
            <ToastContainer />
            <header>
                <h1>Wordle</h1>
            </header>
            {gameState && (
                <Board state={gameState!} updateState={setGameState} />
            )}
            <Keyboard onKey={(key) => handleKey(key)} state={gameState!} />
        </div>
    );
}
