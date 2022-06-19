import { readFile, readdir } from 'fs/promises'
import path from 'path'
import Loki from 'lokijs'
import lfsa from 'lokijs/src/loki-fs-structured-adapter'
import fs from 'fs'

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

  const basename = path.join('data')
  const icons = db.addCollection('icons')

  if (fs.existsSync(CATEGORIES_FILENAME)) {
    fs.unlink(CATEGORIES_FILENAME, (err) => {
      if (err)
        return console.error(err)
    })
  }

  const categoriesSet = new Set()
  const chunkedFilelist = [...chunkFileList(await readdir(basename))]
  for (const chunk of chunkedFilelist) {
    for (const filename of chunk) {
      const fileContents = await readFile(path.join(basename, filename))
      const json = JSON.parse(fileContents)
      icons.insert({ name: json.name, category_name: json.category_name, file: filename})
      categoriesSet.add(json.category_name ? json.category_name : 'Undefined')
    }
  }

  fs.appendFile(CATEGORIES_FILENAME,  Array.from(categoriesSet).toString(), err => {
    if (err) {
      return console.error(err);
    }
  });
}

export async function getIconsDB() {
  if (!iconsDB) {
    await Promise.resolve().then(() => {
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

    iconsDB = db.getCollection('icons')
  }

  return iconsDB
}

export function getIcons(dbRefs) {

  let i = 0
  let result = []
  for (let ref in dbRefs) {
    i++
    console.log(dbRefs[ref])
    result.push(JSON.parse(fs.readFileSync(path.join('data', dbRefs[ref].file))))
    if(i === 20) {
      return result
    }
  }


  // return dbRefs.map(iconRef => JSON.parse(fs.readFileSync(path.join('data', iconRef.file))))
}

export async function getCategories() {
  if (!categories) {
    categories = await readFile(CATEGORIES_FILENAME)
  }
  return categories
}