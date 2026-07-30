import type { Entry, GameState } from "../types/game";
import { appendEntry, useWordleInput } from "../utils";

export default function Board({
    state,
    updateState,
}: {
    state: GameState;
    updateState: React.Dispatch<React.SetStateAction<GameState>>;
}) {
    console.log(state);
    const handleKey = (key: string) => {
        if (key === "Enter") {
            console.log("Enter");
        } else if (key === "Backspace") {
            console.log("Delete");
        } else {
            appendEntry(key, updateState);
        }
    };

    useWordleInput(handleKey);

    return (
        <div className="board">
            {state.attempts.map((row, idx) => (
                <div className="row" key={idx}>
                    {row.attempt.map((entry, idx2) => {
                        let css_class_name = "item ";
                        switch (entry.state) {
                            case "INACTIVE":
                                css_class_name += "inactive";
                                break;
                            case "RIGHT_IN_PLACE":
                                css_class_name += "correct";
                                break;
                            case "RIGHT_OFF_PLACE":
                                css_class_name += "missplaced";
                                break;
                            case "WRONG":
                                css_class_name += "wrong";
                                break;
                        }
                        return (
                            <div key={idx2} className={css_class_name}>
                                <p>{entry.value.toUpperCase()}</p>
                            </div>
                        );
                    })}
                </div>
            ))}
        </div>
    );
}
