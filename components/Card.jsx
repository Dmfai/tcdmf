import Link from 'next/link';

/**
 * 可复用卡片组件
 * @param {object} props
 * @param {string} [props.href] 点击跳转地址，未设置则不渲染为链接
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {string} [props.cover]
 * @param {string[]} [props.tags]
 * @param {React.ReactNode} [props.footer]
 */
export default function Card({ href, title, description, cover, tags = [], footer }) {
  const inner = (
    <article className="card">
      {cover && (
        <div className="card-cover">
          <img src={cover} alt={title} loading="lazy" />
        </div>
      )}
      <div className="card-body">
        <h3 className="card-title">{title}</h3>
        {description && <p className="card-desc">{description}</p>}
        {tags.length > 0 && (
          <div className="card-tags">
            {tags.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>
        )}
        {footer && <div className="card-footer">{footer}</div>}
      </div>
    </article>
  );

  return href ? (
    <Link href={href} className="card-link">{inner}</Link>
  ) : (
    inner
  );
}
