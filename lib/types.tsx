export type Word = {
  a: string
  b: string
  counter: number
  chapter: string
}

export const nullWord = {a: '', b: '', counter: 0, chapter: ''}

export type Chapter = {
  name: string,
  nbWord: number,
  order: number,
  words: Word[],
}