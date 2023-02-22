// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

type Data = {
  name: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const tableName = req.query.tableName as string

  if (!tableName) {
    return res.status(400).json({ name: 'Bad Request' })
  }

  if (req.method === 'GET') {
    const base_id = process.env.AIRTABLE_BASE_ID
    const access_token = process.env.AIRTABLE_ACCESS_TOKEN

    const url = `https://api.airtable.com/v0/${base_id}/${tableName}`
    const headers = {
      Authorization: `Bearer ${access_token}`,
      ContentType: 'application/json',
    }

    // Airtable API is rate limited to 5 requests per second, so we need to
    // throttle the requests.
    await setTimeout(() => {}, 250)

    try {
      const _res = await fetch(url, {method: 'GET', headers: headers,})
      const json = await _res.json()
      const words = json.records.map((r: any) => {return {
        "a": r.fields['a'],
        "b": r.fields['b'],
      }})
      return res.status(200).json(words)

    } catch (error) {
      console.error(error)
      return res.status(500).json({ name: 'Internal Server Error' })
    }
  }
}
