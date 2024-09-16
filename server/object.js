import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  rarity: { type: String, required: true },
  category: { type: String, required: true }
});

const Card = mongoose.model('Card', cardSchema);

export default Card;
