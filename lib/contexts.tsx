import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Chapter, Word } from "@/lib/types";

export type SessionContextType = {
    selectedChapter: Chapter[];
    nbGoodAnswers: number;
    nbBadAnswers: number;
    wordHistory: Word[];
    responseTime: number[];
};

export const defaultSessionValue: SessionContextType = {
    selectedChapter: [],
    nbGoodAnswers: 0,
    nbBadAnswers: 0,
    wordHistory: [],
    responseTime: [],
};

export const SessionContext = createContext<SessionContextType>(defaultSessionValue);

export const SetSessionContext = createContext<React.Dispatch<React.SetStateAction<SessionContextType>>>((value) => {
    console.log(value);
});