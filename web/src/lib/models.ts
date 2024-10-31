export interface ICounter {
    id: string;
    name: string;
    softReset: string;
    createdAt: string;
    updatedAt: string;
}

export interface IData {
    id: string;
    number: number;
    counterRef: string;
    createdAt: string;
    updatedAt: string;
}

export type AvgDisplayType = "numeric" | "human";
export interface ISettings {
    useGlobal: boolean;
    avgDisplay: AvgDisplayType;
}
