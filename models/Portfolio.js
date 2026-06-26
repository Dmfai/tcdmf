import mongoose from 'mongoose';

const PortfolioSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: '' },
    cover: { type: String, default: '' }, // 封面图 URL
    tags: [{ type: String }],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.Portfolio || mongoose.model('Portfolio', PortfolioSchema);
