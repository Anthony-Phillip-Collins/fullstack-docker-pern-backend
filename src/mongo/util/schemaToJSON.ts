import { Schema } from 'mongoose';

type ReturnedObject = {
  id?: string;
  _id?: string;
  __v?: number;
};

export default (schema: Schema) => {
  schema.set('toJSON', {
    transform: (_document, returnedObject: ReturnedObject) => {
      returnedObject.id = returnedObject._id && returnedObject._id.toString();
      delete returnedObject._id;
      delete returnedObject.__v;
    },
  });
};
