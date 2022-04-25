import 'reflect-metadata'
import path from 'path'
import fs from 'fs'

import express from 'express'
import { graphqlHTTP } from 'express-graphql'

import { print } from 'graphql'
import { buildSchema } from 'type-graphql'

// 參照: https://www.graphql-tools.com/docs
import { loadFiles } from '@graphql-tools/load-files'
import { mergeTypeDefs } from '@graphql-tools/merge'
import { makeExecutableSchema } from '@graphql-tools/schema'

import ExampleResolver from './resolvers/example-resolver'

/**
 * 使用 type-graphql 來 parse 以 TS 寫成的 graphql resolver，並將其輸出成靜態檔案
 */
;(async () => {
  /**
   * @returns {Object} 回傳 graphql type definition object
   */
  await buildSchema({
    // 接受一個 array of resolvers
    resolvers: [ExampleResolver],

    // 輸出的靜態檔案目標
    emitSchemaFile: './schemas/_auto-generated-schema.gql',
  })
})()

/**
 * 合併多個 .gql 檔案成單一 .gql 檔案
 */
;(async () => {
  // 從多個 .gql 檔案讀取成 array of graphql type definitions
  const typeDefs = await loadFiles(path.join(__dirname, './schemas/*.gql'))

  // 將多個 graphql type definitions 合併成一個 type definition
  const mergedTypeDefs = mergeTypeDefs(typeDefs)

  // 將 graphql type definition 從 object 轉換成 SDL 字串，之後將其輸出為靜態檔案
  const printedTypeDefs = print(mergedTypeDefs)
  fs.writeFileSync('./schemas/schema.gql', printedTypeDefs)
})()


const app = express()

// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema: makeExecutableSchema({
//       typeDefs: fs.readFileSync('./schemas/schema.gql', { encoding: 'utf-8' })
//     }),
//     graphiql: true
//   })
// )

app.listen(8000, () => {
  console.log('Server start at 8000')
})
