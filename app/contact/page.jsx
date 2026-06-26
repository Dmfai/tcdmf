'use client';

import { useState } from 'react';
import { submitContact } from '@/lib/api';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState({ state: 'idle', msg: '' });

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setStatus({ state: 'loading', msg: '发送中...' });
    try {
      await submitContact(form);
      setStatus({ state: 'success', msg: '已收到，我们会尽快联系你！' });
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setStatus({ state: 'error', msg: err.message || '提交失败，请稍后再试。' });
    }
  };

  return (
    <div className="container">
      <header className="page-header">
        <h1>联系文辉</h1>
        <p>一对一咨询、品牌策划、内容路线搭建 — 告诉我们你的需求，我们会在 24 小时内回复。</p>
      </header>

      <form className="form" onSubmit={onSubmit} style={{ paddingBottom: 80 }}>
        <div className="form-group">
          <label className="form-label" htmlFor="name">姓名</label>
          <input
            id="name"
            name="name"
            className="form-input"
            value={form.name}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="email">邮箱</label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-input"
            value={form.email}
            onChange={onChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="message">需求描述</label>
          <textarea
            id="message"
            name="message"
            className="form-textarea"
            value={form.message}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit" className="btn" disabled={status.state === 'loading'}>
          {status.state === 'loading' ? '发送中...' : '发送'}
        </button>
        {status.msg && (
          <p style={{ marginTop: 16, color: status.state === 'error' ? '#c00' : '#070' }}>
            {status.msg}
          </p>
        )}
      </form>
    </div>
  );
}
