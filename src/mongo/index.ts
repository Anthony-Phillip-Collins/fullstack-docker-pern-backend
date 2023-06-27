import mongoose from 'mongoose';

const connectToMongo = (): Promise<typeof mongoose> => mongoose.connect(process.env.DATABASE_URL || '', {});

export default connectToMongo;
