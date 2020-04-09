const mongoose = require('mongoose');
//Mongoose's findOneAndUpdate() long pre-dates the MongoDB driver's
// findOneAndUpdate() function, so it uses the MongoDB driver's 
//findAndModify() function
mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

console.log('connecting to', url)

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})
        .then(result => {
          console.log('connected to MongoDB')
        })
        .catch((error) => {
          console.log('error connecting to MongoDB:', error.message)
        })

const personSchema = new mongoose.Schema({
  name: String,
  number: Number,
});

const Person = mongoose.model('Person', personSchema);
// removing and changing the  __v and _id from the api persons data
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model('Person', personSchema);