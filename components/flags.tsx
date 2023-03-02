import React from 'react'
import { Button, useColorModeValue } from '@chakra-ui/react'
import { SessionContext } from '@/lib/contexts'
import { bsL, bsD } from '@/lib/utils'

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
      <rect x="1" y="1" width="34" height="25" rx="5" fill="#338ADA" stroke="white" stroke-width="2" />
      <path d="M2 13H34V21C34 23.2091 32.2091 25 30 25H6C3.79086 25 2 23.2091 2 21V13Z" fill="#DAA00D" />
    </svg>
  )
}


export const FlagFrance = () => {
  return (
    <svg width="36" height="27" viewBox="0 0 36 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="34" height="25" rx="5" fill="#FF0000" stroke="white" stroke-width="2" />
      <rect x="9.5" y="1.5" width="4" height="24" fill="#289CDE" stroke="white" />
      <rect x="34.5" y="11.5" width="4" height="33" transform="rotate(90 34.5 11.5)" fill="#289CDE" stroke="white" />
      <path d="M13 11.0307L13 16L10 15.9693L10 11L13 11.0307Z" fill="#289CDE" />
    </svg>
  )
}


export const FlagEngland = () => {
  return (
    <svg width="36" height="27" viewBox="0 0 36 27" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="1" y="1" width="34" height="25" rx="5" fill="#150996" stroke="white" stroke-width="2" />
      <rect x="22" y="2" width="24" height="7" transform="rotate(90 22 2)" fill="white" />
      <rect x="2" y="11" width="32" height="5" fill="white" />
      <rect x="3.71474" y="0.200989" width="38.798" height="4.29404" transform="rotate(36.6366 3.71474 0.200989)" fill="white" />
      <rect x="34.9158" y="3.76416" width="38.798" height="4.29404" transform="rotate(143.762 34.9158 3.76416)" fill="white" />
      <rect x="2.97277" y="1.19873" width="38.798" height="1.8073" transform="rotate(36.6366 2.97277 1.19873)" fill="#F00A0A" />
      <rect x="34.2204" y="2.82117" width="38.798" height="1.8073" transform="rotate(143.974 34.2204 2.82117)" fill="#F00A0A" />
      <rect x="21" y="2" width="24" height="5" transform="rotate(90 21 2)" fill="#F00A0A" />
      <rect x="2" y="12" width="32" height="3" fill="#F00A0A" />
      <rect x="1" y="1" width="34" height="25" rx="5" stroke="white" stroke-width="2" />
    </svg>

  )
}


export const FlagButton: React.FC<{ callback: () => void }> = ({ callback }) => {
  const session = React.useContext(SessionContext)

  return (
    <Button onClick={callback}
      boxShadow={useColorModeValue(bsL, bsD)}
      borderColor={useColorModeValue('gray.200', 'gray.900')}
    >
      {session.language === 'en' && <FlagEngland />}
      {session.language === 'uk' && <FlagUkraine />}
    </Button>
  )
}