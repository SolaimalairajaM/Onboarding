// import { Connection, Request } from 'tedious'

// export class SQLDatabaseProvider {
//   connection
//   config
//   private data = []

//   constructor(config) {
//     this.config = config
//   }

//   async doQuery(query: string) {
//     await this.connect()
//     const result = await this.queryDatabase(query)
//     await this.disconnect()
//     return result
//   }

//   async connect() {
//     this.connection = new Connection(this.config)
//     return new Promise((resolve, reject) => {
//       this.connection.connect((err) => {
//         if (err) {
//           reject(err)
//         } else {
//           console.debug(`Connected`)
//           resolve('connected!')
//         }
//       })
//     })
//   }

//   async disconnect() {
//     await this.connection.close()
//     return new Promise((resolve) => {
//       this.connection.on('end', () => {
//         console.debug('connection ended')
//         resolve(true)
//       })
//     })
//   }

//   queryDatabase(sql: string) {
//     this.data = []
//     console.debug('Reading rows from the Table...')
//     console.debug('\t', 'Getting data by: ', JSON.stringify(sql))
//     const request = new Request(sql, (err, rowCount) => {
//       if (err) {
//         throw new Error(`${err}`)
//       }
//       console.debug(`${rowCount} row(s) returned`)
//     })

//     request.on('row', (columns) => {
//       const obj = {};
//       columns.forEach((column) => {
//         obj[column.metadata.colName] = column.value
//       })
//     //  this.data.push(obj)
//     })

//     this.connection.execSql(request)

//     return new Promise((resolve) => {
//       request.on('requestCompleted', () => {
//         resolve(this.data)
//       })
//     })
//   }
// }
 