export type MutHandler = (target: Element) => void;

export interface Handlers {
    global: MutHandler[];
    orochi: MutHandler[];
    panda: MutHandler[];
}
