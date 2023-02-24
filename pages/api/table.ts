// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import Word from '../../type/word'
import Airtable from 'airtable'


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const tableName = req.query.tableName as string

  if (!tableName) {
    return res.status(400).json({ name: 'Bad Request' })
  }  

  const BASE_ID = process.env.AIRTABLE_BASE_ID
  const ACCESS_TOKEN = process.env.AIRTABLE_ACCESS_TOKEN

  if (!BASE_ID || !ACCESS_TOKEN) {
    return res.status(500).json({ name: 'Internal Server Error' })
  }

  // if (req.method === 'GET') {
  //   const base_id = process.env.AIRTABLE_BASE_ID
  //   const access_token = process.env.AIRTABLE_ACCESS_TOKEN

  //   const url = `https://api.airtable.com/v0/${base_id}/${tableName}`
  //   const headers = {
  //     Authorization: `Bearer ${access_token}`,
  //     ContentType: 'application/json',
  //   }

  //   // Airtable API is rate limited to 5 requests per second, so we need to
  //   // throttle the requests.
  //   await setTimeout(() => {}, 250)

  //   try {
  //     const _res = await fetch(url, {method: 'GET', headers: headers,})
  //     const json = await _res.json()

  //     console.log('json')
  //     console.log(json)

  //     const words = json.records.map((r: any) => {return {
  //       "a": r.fields['a'],
  //       "b": r.fields['b'],
  //     }})
  //     return res.status(200).json(words)

  //   } catch (error) {
  //     console.error(error)
  //     return res.status(500).json({ name: 'Internal Server Error' })
  //   }
  // }

  if (req.method === 'GET') {
    let wordsJson: Word[]  = []

    const base = new Airtable({apiKey: ACCESS_TOKEN}).base(BASE_ID)
    const records = await base(tableName).select().all();

    records.forEach((record) => {
      wordsJson.push({
        a: record.get('a') as string,
        b: record.get('b') as string,
        chapter: record.get('chapter') as string,
        counter: 0,
      })
    })

    return res.status(200).json(wordsJson)
  }
}
