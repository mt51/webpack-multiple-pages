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
  template: path.resolve(baseDir, 'index.html')
}]



viewArr.forEach(dir => {
  const enrtyFile = dir + '.js'
  const filename = dir + '/' + dir + '.html'
  entriesConfig.push({
    entryName: dir,
    entry: path.resolve(baseDir, dir, enrtyFile),
    filename: filename,
    template: path.resolve(baseDir, filename)
  })
})

module.exports = entriesConfig