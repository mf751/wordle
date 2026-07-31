import type { GameState } from "../types/game";

export default function Board({ state }: { state: GameState }) {
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
