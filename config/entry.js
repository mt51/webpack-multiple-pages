const path = require('path')
const fs = require('fs')
const baseDir = path.resolve(__dirname, '../src/views')

const excludeDir = ['index']
const viewArr = fs.readdirSync(baseDir).filter(dir => {
  return excludeDir.indexOf(dir) === -1 && fs.statSync(baseDir + '/' + dir).isDirectory()
})

let entriesConfig = [{
  entryName: 'index',
  entry: path.resolve(baseDir, 'index/index.js'),
  filename: 'index.html',
  template: path.resolve(__dirname, '../index.html')
}]

viewArr.forEach(generateEntryConfig)

function generateEntryConfig (dir) {
  const enrtyFile = 'index.js'
  const filename = dir + '/index.html'
  entriesConfig.push({
    entryName: dir,
    entry: path.resolve(baseDir, dir, enrtyFile),
    filename: filename,
    template: path.resolve(__dirname, '../index.html')
  })
  const dirPath = path.resolve(baseDir, dir)
  const files = fs.readdirSync(dirPath);

  const subDirs = files.filter(sub => {
    return fs.statSync(dirPath + '/' + sub).isDirectory()
  }).map(dirName => {
    return dir + '/' + dirName
  })
  if (subDirs.length > 0) {
    subDirs.forEach(generateEntryConfig)
  }
}
module.exports = entriesConfig
