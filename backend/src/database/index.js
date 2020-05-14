import mongoose from 'mongoose';

class Database {
  constructor() {
    this.mongo();
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      'mongodb+srv://julio:32991046@omnisstack-a9vqx.mongodb.net/book-on-table?retryWrites=true&w=majority',
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      },
      () => console.log('Database Connected')
    );
  }
}

export default new Database();
