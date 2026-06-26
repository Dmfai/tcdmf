import mongoose from 'mongoose';

const BlogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    content: { type: String, required: true }, // Markdown 格式
    excerpt: { type: String, default: '' },
    tags: [{ type: String, index: true }],
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// 全文搜索辅助索引
BlogSchema.index({ title: 'text', content: 'text' });

export default mongoose.models.Blog || mongoose.model('Blog', BlogSchema);
