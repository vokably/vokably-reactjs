import React from 'react'
import { Button } from '@chakra-ui/react'
import { SessionContext } from '@/lib/contexts'

export const FlagNorway = () => {
    return (
    <svg width="36" height="27" viewBox="0 0 36 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="34" height="25" rx="5" fill="#FF0000" stroke="white" stroke-width="2" />
        <rect x="9.5" y="1.5" width="4" height="24" fill="#289CDE" stroke="white" />
        <rect x="34.5" y="11.5" width="4" height="33" transform="rotate(90 34.5 11.5)" fill="#289CDE" stroke="white" />
        <path d="M13 11.0307L13 16L10 15.9693L10 11L13 11.0307Z" fill="#289CDE" />
    </svg>
    )
}

export const FlagUkraine = () => {
    return (
        <svg width="36" height="27" viewBox="0 0 36 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="34" height="25" rx="5" fill="#338ADA" stroke="white" stroke-width="2"/>
        <path d="M2 13H34V21C34 23.2091 32.2091 25 30 25H6C3.79086 25 2 23.2091 2 21V13Z" fill="#DAA00D"/>
        </svg>
    )
}


export const FlagFrance = () => {
    return (
        <svg width="36" height="27" viewBox="0 0 36 27" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="1" y="1" width="34" height="25" rx="5" fill="#FF0000" stroke="white" stroke-width="2"/>
        <rect x="9.5" y="1.5" width="4" height="24" fill="#289CDE" stroke="white"/>
        <rect x="34.5" y="11.5" width="4" height="33" transform="rotate(90 34.5 11.5)" fill="#289CDE" stroke="white"/>
        <path d="M13 11.0307L13 16L10 15.9693L10 11L13 11.0307Z" fill="#289CDE"/>
        </svg>
    )
}


export const FlagButton: React.FC<{callback: () => void}> = ({callback}) => {
    const session = React.useContext(SessionContext)

    return (
        <Button onClick={callback} bg={'#00000000'}>
            {session.language === 'en' && <FlagNorway />}
            {session.language === 'uk' && <FlagUkraine />}
        </Button>
    )
}