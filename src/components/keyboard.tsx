import { type Entry, type EntryState, type GameState } from "../types/game";

const rows = [
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Enter", "Z", "X", "C", "V", "B", "N", "M", "Backspace"],
];

export default function Keyboard({
    onKey,
    state,
}: {
    onKey: (key: string) => void;
    state: GameState;
}) {
    const keystates: Record<string, EntryState> = {};

    state.attempts.forEach((att) => {
        att.attempt.forEach((e: Entry) => {
            if (keystates[e.value]) {
                const v = keystates[e.value];
                if (v !== "RIGHT_IN_PLACE") {
                    if (v === "WRONG") keystates[e.value] = e.state;
                    if (v === "RIGHT_OFF_PLACE" && e.state === "RIGHT_IN_PLACE")
                        keystates[e.value] = e.state;
                }
            } else {
                keystates[e.value] = e.state;
            }
        });
    });

    return (
        <div className="keyboard">
            {rows.map((row, i) => (
                <div key={i} className="row">
                    {row.map((key) => {
                        return (
                            <button
                                className={`item ${keystates[key.toLowerCase()] ? keystates[key.toLowerCase()].replace("WRONG", "wrong").replace("RIGHT_IN_PLACE", "correct").replace("RIGHT_OFF_PLACE", "missplaced") : ""}`}
                                key={key}
                                onClick={() => onKey(key.toLowerCase())}
                            >
                                {key === "Backspace" ? "⌫" : key}
                            </button>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
