import { NextApiRequest, NextApiResponse } from 'next'
import { getAllChapter } from '@/lib/utils'

// Create an API route that returns the table data
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method not allowed' })
    return
  }

  if (req.query.lang === undefined) {
    res.status(400).json({ message: 'Bad request' })
    return
  }

  const allChapter = await getAllChapter(req.query.lang as string)
  res.status(200).json(allChapter)
}