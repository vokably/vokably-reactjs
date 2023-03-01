import { Chapter, Word } from '@/lib/types'
import Airtable from 'airtable'

function memoize<R, T extends (...args: any[]) => R>(f: T): T {
  const memory = new Map<string, R>();

  const g = (...args: any[]) => {
      if (!memory.get(args.join())) {
          memory.set(args.join(), f(...args));
      }

      return memory.get(args.join());
  };

  return g as T;
}

export const zip = (...rows: any[]) => [...rows[0]].map((_, c) => rows.map(row => row[c]))

export const shuffleArray = (array: any[]) => {
  for (var i = array.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}


const _getAllChapter = async (lang: string | undefined) => {
  const BASE_ID = process.env.AIRTABLE_BASE_ID as string
  const ACCESS_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN as string

  let tableName = "en-no-json-01"
  if (lang) {
    tableName = lang === "en" ? "en-no-json-01" : "uk-no-json-01"
  }

  const base = new Airtable({ apiKey: ACCESS_TOKEN }).base(BASE_ID)
  const records = await base(tableName).select().all();

  let chapters: Chapter[] = []
  records.forEach((record) => {
    let wordsJson: Word[] = []
    const rawVocabulary = JSON.parse(record.get('words') as string)
    rawVocabulary.forEach((w: any) => {
      wordsJson.push({
        a: w.a,
        b: w.b,
        chapter: record.get('chapter') as string,
        counter: 0,
      })
    })

    const chapterInfo: Chapter = {
      name: record.get('chapter') as string,
      nbWord: record.get('nbWord') as number,
      order: record.get('order') as number,
      words: wordsJson,
    }

    chapters.push(chapterInfo)
  });

  // sort the words by order
  chapters.sort((a, b) => (a.order > b.order) ? 1 : -1)

  return chapters
}

export const getAllChapter = memoize(_getAllChapter)