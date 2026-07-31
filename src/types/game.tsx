export type EntryState =
    | "RIGHT_IN_PLACE"
    | "RIGHT_OFF_PLACE"
    | "WRONG"
    | "INACTIVE";

export type Entry = {
    value: string;
    state: EntryState;
};

export type Attempt = {
    attempt: Entry[];
};

export type Position = {
    row: number;
    col: number;
};

export type GameState = {
    word: string;
    attempts: Attempt[];
    position: Position;
    isFinsihed: boolean;
    won: boolean;
};
