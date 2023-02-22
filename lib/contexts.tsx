import { createContext, PropsWithChildren, useContext, useState } from "react";
import Word from '../type/word';
import TableInfo from "../type/tableInfo";

export type SessionContextType = {
    loadedChapters: TableInfo[];
    allWords: Word[];
    nbGoodAnswers: number;
    nbBadAnswers: number;
    wordHistory: Word[];
    responseTime: number[];
};

export const defaultSessionValue: SessionContextType = {
    loadedChapters: [],
    allWords: [],
    nbGoodAnswers: 0,
    nbBadAnswers: 0,
    wordHistory: [],
    responseTime: [],
};

export const SessionContext = createContext<SessionContextType>(defaultSessionValue);

export const SetSessionContext = createContext<React.Dispatch<React.SetStateAction<SessionContextType>>>((value) => {
    console.log(value);
});