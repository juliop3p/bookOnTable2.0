import mongoose from 'mongoose';

class Database {
  constructor() {
    this.mongo();
  }

  mongo() {
    this.mongoConnection = mongoose.connect(
      process.env.NODE_ENV === 'test'
        ? process.env.MONGO_URI
        : process.env.MONGO_URI_TEST,
      {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      }
    );
  }
}

export default new Database();
