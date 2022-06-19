import { getIconsDB, getIcons } from '../../src/db'


// API calls:
// /api/search?param=category&value=emoji
// /api/search?param=name&value=sun
export default async function handler(req, res) {
  const icons = await getIconsDB()
  
  if (req.method === 'POST') {
    const { param, value } = req.query
    let iconRefs
    if(param === 'name') {
      if(value?.length < 3)
        return res.status(200).json([])
      iconRefs = icons.find({ name: { '$regex': new RegExp(value, 'i') } })
    } else if (param === 'category') {
      iconRefs = icons.find({ category_name: value })
    } else {
      return res.status(400).json([])
    }
    const foundIcons = await getIcons(iconRefs)
    return  res.status(200).json(foundIcons)
  } else {
    return res.status(405).json({ error: 'method not supported, please use POST' })
  }
}
