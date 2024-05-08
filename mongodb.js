import { MongoClient, ObjectId } from 'mongodb'

// Enable command monitoring for debugging
const client = new MongoClient('mongodb://0.0.0.0:27017', {
  monitorCommands: true,
})

client.on('commandStarted', (started) => console.log('started'))
//adding a document

// client
//   .db()
//   .collection('tasks')
//   .insertOne({ description: 'Pot plants1', completed: false })
//   .then((res) => {
//     console.log(res)
//   })

// client
//   .db()
//   .collection('tasks')
//   .insertMany([{ description: 'Pot plants1', completed: false }, { description: 'Pot plants2', completed: true }])
//   .then((res) => {
//     console.log(res)
//   })

//read from the db
// client
//   .db('test')
//   .collection('tasks')
//   .find({ completed: false })
//   .forEach((doc) => {
//     console.log(doc)
//   })

// client
//     .db('test')
//     .collection('tasks')
//     .findOne({ completed: false })
//     .then((response) => {
//       console.log(response)
//     })

//update a document

// client
//   .db()
//   .collection('tasks')
//   .updateOne(
//     { _id: new ObjectId('66336c2290176af5b4c13d1c') },
//     {
//       $set: {
//         completed: true,
//       },
//     }
//   )
//   .then((res) => {
//     console.log(res)
//   })
//   .catch((error) => {
//     console.log(error)
//   })

// client
//   .db()
//   .collection('tasks')
//   .updateMany(
//     { completed: true },
//     {
//       $set: {
//         completed: false,
//       },
//     }
//   )
//   .then((res) => {
//     console.log(res)
//   })
//   .catch((error) => {
//     console.log(error)
//   })

//delete a document

// client
//   .db()
//   .collection('tasks')
//   .deleteOne({
//     description: 'Pot plants',
//   })
//   .then((res) => {
//     console.log(res)
//   })
//   .catch((err) => {
//     console.log(err)
//   })

// client
//   .db()
//   .collection('tasks')
//   .deleteMany({
//     description: 'Pot plants',
//   })
//   .then((res) => {
//     console.log(res)
//   })
//   .catch((err) => {
//     console.log(err)
//   })
