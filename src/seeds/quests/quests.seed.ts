import mongoose from 'mongoose';
import { MONGO_URI } from '../../utils/config';
import { QuestsSchema } from '../../mongo-schemas/quests.schema';
import { questsData } from './questsData';

const QuestsModel = mongoose.model('Quests', QuestsSchema);

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    await QuestsModel.deleteMany({});
    await QuestsModel.insertMany(questsData);
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
