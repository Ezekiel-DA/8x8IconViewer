import { readFile, readdir, unlink, appendFile } from 'fs/promises'
import path from 'path'
import Loki from 'lokijs'
import lfsa from 'lokijs/src/loki-fs-structured-adapter'

import { iconsFilePath, resultsLimiter } from '../config'

const CATEGORIES_FILENAME = 'categories'
const ICONS_FILENAME = 'icons.db'

const adapter = new lfsa()

const db = new Loki(ICONS_FILENAME, { adapter })

let iconsDB
let categories

function* chunkFileList(ls, chunkSize = 5000) {
  for (let idx = 0; idx < ls.length; idx += chunkSize) {
    yield ls.slice(idx, idx + chunkSize)
  }
}

async function createDBFromFiles() {
  const icons = db.addCollection('icons')

  try {
    await unlink(CATEGORIES_FILENAME)
  } catch (err) {
    if (err.code === 'ENOENT') {
      // catch and bury on purpose: it's okay to fail to unlink because the file doesn't exist; anything else we'll rethrow
    } else {
      throw err
    }
  }

  const categoriesSet = new Set()
  const chunkedFilelist = [...chunkFileList(await readdir(iconsFilePath))]
  for (const chunk of chunkedFilelist) {
    for (const filename of chunk) {
      const fileContents = await readFile(path.join(iconsFilePath, filename))
      const json = JSON.parse(fileContents)
      icons.insert({ name: json.name, category_name: json.category_name, file: filename })
      categoriesSet.add(json.category_name ? json.category_name : 'Undefined')
    }
  }

  appendFile(CATEGORIES_FILENAME, Array.from(categoriesSet).toString())
}

async function initDB() {
  return Promise.resolve().then(() => {
    return new Promise((resolve, reject) => {
      console.log('Loading DB from disk')
      db.loadDatabase({}, async err => {
        if (err) {
          reject(err);
        } else {
          if (!db.getCollection('icons')) {
            console.log('DB empty; processing raw icon files...')
            await createDBFromFiles()

            db.saveDatabase(err => {
              if (err) {
                reject(err)
              } else {
                console.log('Saved DB to disk')
                resolve(db)
              }
            })

          } else {
            console.log('DB loaded from disk successfully')
            resolve(db)
          }
        }
      })
    })
  })
}

export async function getIconsDB() {
  if (!iconsDB) {
    await initDB()
    iconsDB = db.getCollection('icons')
  }

  return iconsDB
}

export async function getIcons(dbRefs) {
  return Promise.all(dbRefs.slice(0, resultsLimiter).map(async iconRef => JSON.parse(await readFile(path.join(iconsFilePath, iconRef.file)))))
}

export async function getCategories() {
  if (!categories) {
    try {
      categories = await readFile(CATEGORIES_FILENAME, {encoding: 'utf8'})
    } catch (err) {
      if (err.code === 'ENOENT') {
        await initDB() // TODO: is it worth it to make creation of the categories file not a side effect of initDB()?
        return getCategories()
      } else {
        throw err
      }
    }

  }
  return categories
}
