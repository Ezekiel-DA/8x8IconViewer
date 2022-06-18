import { getCategories } from '../../src/db'

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const categories = await getCategories()
    return res.status(200).json(categories)
  } else {
    return res.status(405).json({ error: 'method not supported, please use POST' })
  }
}
