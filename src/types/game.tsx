export type EntryState =
    | "exists and in place"
    | "exists"
    | "not exists"
    | "inactive";

export type Entry = {
    value: string;
    state: EntryState;
};

export type Attempt = {
    attempt: Entry[];
};
export type GameState = {
    word: string;
    attempts: Attempt[];
};
