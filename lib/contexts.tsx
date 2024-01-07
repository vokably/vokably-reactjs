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


export type Answer = {
  word: { a: Word, b: Word },
  isCorrect: boolean,
  responseTime: number,
}

export type LearningSession = {
  startDate: Date,
  endDate: Date,
  answers: Answer[],
  loadedChapter: Chapter[],
  nbUniqueWord: number,
}

export const defaultLearningSession: LearningSession = {
  startDate: new Date(),
  endDate: new Date(),
  answers: [],
  loadedChapter: [],
  nbUniqueWord: 0,
}


export const LearningSessionContext = createContext<LearningSession>(defaultLearningSession);

export const SetLearningSessionContext = createContext<React.Dispatch<React.SetStateAction<LearningSession>>>((value) => {
  console.log(value);
});