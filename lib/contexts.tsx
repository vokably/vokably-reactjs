import { createContext, PropsWithChildren, useContext, useState } from "react";
import { Chapter, Word } from "@/lib/types";

export type SessionContextType = {
    language: string;
    airtable: string;
    selectedChapter: Chapter[];
    nbGoodAnswers: number;
    nbBadAnswers: number;
    wordHistory: Word[];
    responseTime: number[];
};

export const defaultSessionValue: SessionContextType = {
    language: "en",
    airtable: "en-no-json-01",
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