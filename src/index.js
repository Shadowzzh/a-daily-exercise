var fs = require('fs')

;(async () => {
  const algorithmInfoList = await getFileInfoListInDir('algorithm')
  writeDataToTargetFile(`README.md`, algorithmInfoList, classifiedYear)

  console.log(fs.readdirSync(`${process.cwd()}`),1)
})()

/**
 * 写入数据到目标文件
 * @param {* string} fileName 文件名
 * @param {* array } data 数据
 * @param {* function } order 组织数据方式
 */
function writeDataToTargetFile(fileName, data, order) {
  const fileInfoListByOrder = order(data)
  let content = ''

  for (const year in fileInfoListByOrder) {
    if (!Object.hasOwnProperty.call(fileInfoListByOrder, year)) continue

    const fileInfoList = fileInfoListByOrder[year]
    const fileInfoContent = fileInfoList.reduce(
      (fileContent, fileInfo) =>
        `${fileContent}   - [${fileInfo.fullName}](/${fileInfo.dirName}/${fileInfo.fullName})
`,
      ''
    )

    content += `# 多2021.12.23-36_有效的数独-[简单]日一题

- ## **${year}**
${fileInfoContent}
`
  }

  fs.writeFileSync(fileName, content, () => {})
}

/**
 * 把 fileInfoList 按照年份分类
 * @param {* Array} fileInfoList
 */
function classifiedYear(fileInfoList) {
  const classified = {}

  fileInfoList.reduce((classified, fileInfo) => {
    const { year } = fileInfo

    classified[year] || (classified[year] = [])
    classified[year].unshift(fileInfo)

    return classified
  }, classified)

  return classified
}

/**
 * 获取 dirname 目录中所有文件名, 并按照文件名中的格式获取信息，生成文件信息列表
 * @param {* string} dirName 目录名
 */
function getFileInfoListInDir(dirName) {
  return new Promise((resolve, reject) => {
    fs.readdir(`${process.cwd()}/${dirName}`, (err, fileNameList) => {
      const fileInfoList = fileNameList.map((fileName) => {
        try {
          const date = fileName.match(/.+\.[0-9]+/)[0]
          const [year, month, day] = date.split('.')
          const fileInfo = {
            dirName,
            date,
            year,
            month,
            day,
            questionId: fileName.match(/-[0-9]+/)[0].slice(1),
            name: fileName.match(/_.+]/)[0].slice(1),
            fullName: fileName
          }

          return fileInfo
        } catch (error) {
          reject([])
        }
      })
      resolve(fileInfoList)
    })
  })
}
