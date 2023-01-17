// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';



const { User, Room, Message } = initSchema(schema);

export {
  User,
  Room,
  Message
};