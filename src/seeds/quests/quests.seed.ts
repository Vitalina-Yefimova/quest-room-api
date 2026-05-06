import mongoose from 'mongoose';
import { QuestsSchema } from '../../mongo-schemas/quests.schema';
import { MONGODB_URI } from '../../utils/config';
import { questsData } from './questsData';

const QuestsModel =
  mongoose.models.Quests ?? mongoose.model('Quests', QuestsSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 15_000,
    });
    const cleared = await QuestsModel.deleteMany({});
    const inserted = await QuestsModel.insertMany(questsData);
    console.info(
      `Quests seeded: removed ${cleared.deletedCount}, inserted ${inserted.length}`,
    );
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

void seed();
