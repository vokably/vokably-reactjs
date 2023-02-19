import { createContext, PropsWithChildren, useContext, useState } from "react";

export type SessionContextType = {
    loadedChapters: string[];
};

export const SessionContext = createContext<SessionContextType>({
    loadedChapters: [],
});

export const SetSessionContext = createContext<React.Dispatch<React.SetStateAction<SessionContextType>>>((value) => {
    console.log(value);
});