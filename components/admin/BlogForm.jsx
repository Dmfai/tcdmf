'use client';

import { useState } from 'react';
import Link from 'next/link';

/**
 * 博客表单（新建 / 编辑共用）
 * @param {object} props
 * @param {object} [props.initial] 初始值 { title, slug, tags, content }
 * @param {(data) => Promise<void>} props.onSubmit 提交回调
 * @param {string} props.submitText 按钮文案
 * @param {string} [props.backHref] 返回链接
 */
export default function BlogForm({ initial = {}, onSubmit, submitText = '保存', backHref = '/admin/blogs' }) {
  const [form, setForm] = useState({
    title: initial.title || '',
    slug: initial.slug || '',
    tags: (initial.tags || []).join(', '),
    content: initial.content || '',
  });
  const [status, setStatus] = useState({ state: 'idle', msg: '' });

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) {
      setStatus({ state: 'error', msg: '标题和内容必填' });
      return;
    }
    setStatus({ state: 'loading', msg: '保存中…' });
    try {
      const payload = {
        title: form.title.trim(),
        content: form.content,
        tags: form.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };
      if (form.slug.trim()) payload.slug = form.slug.trim();
      await onSubmit(payload);
      setStatus({ state: 'success', msg: '保存成功' });
    } catch (err) {
      setStatus({ state: 'error', msg: err.message || '保存失败' });
    }
  };

  return (
    <form className="admin-form" onSubmit={handleSubmit}>
      <div className="admin-field">
        <label className="admin-label" htmlFor="title">标题 *</label>
        <input
          id="title"
          name="title"
          className="admin-input"
          value={form.title}
          onChange={onChange}
          placeholder="文章标题"
          required
        />
      </div>

      <div className="admin-field">
        <label className="admin-label" htmlFor="slug">
          Slug（留空自动生成，编辑时修改会导致旧链接失效）
        </label>
        <input
          id="slug"
          name="slug"
          className="admin-input"
          value={form.slug}
          onChange={onChange}
          placeholder="my-first-post"
        />
      </div>

      <div className="admin-field">
        <label className="admin-label" htmlFor="tags">标签（逗号分隔）</label>
        <input
          id="tags"
          name="tags"
          className="admin-input"
          value={form.tags}
          onChange={onChange}
          placeholder="设计, Next.js, 随笔"
        />
      </div>

      <div className="admin-field">
        <label className="admin-label" htmlFor="content">
          正文（Markdown）*
        </label>
        <textarea
          id="content"
          name="content"
          className="admin-textarea"
          value={form.content}
          onChange={onChange}
          placeholder="# 标题&#10;&#10;在这里写正文…"
          rows={18}
          required
        />
      </div>

      <div className="admin-form-actions">
        <button
          type="submit"
          className="admin-btn-primary"
          disabled={status.state === 'loading'}
        >
          {status.state === 'loading' ? '保存中…' : submitText}
        </button>
        <Link href={backHref} className="admin-btn-ghost">
          取消
        </Link>
        {status.msg && (
          <span
            className="admin-form-msg"
            style={{ color: status.state === 'error' ? '#c00' : '#070' }}
          >
            {status.msg}
          </span>
        )}
      </div>
    </form>
  );
}
