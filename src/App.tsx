import { useEffect, useState } from "react";
import Board from "./components/board";
import type { GameState, Attempt, Entry, Position } from "./types/game";
import { getRandomWord } from "./utils";

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

    useEffect(() => {
        (async () => {
            const word = await getRandomWord();
            setGameState((prev) => ({ ...prev, word: word }));
        })();
    }, []);

    return (
        <div className="main">
            <header>
                <h1>Wordle</h1>
            </header>
            {gameState && (
                <Board state={gameState!} updateState={setGameState} />
            )}
        </div>
    );
}
