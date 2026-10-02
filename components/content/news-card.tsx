import Link from "next/link";
import { formatDate, type NewsPreview } from "@/lib/news";
import { ShareActions } from "./share-actions";

export function NewsCard({ post }: { post: NewsPreview }) {
  return <article className="editorial-card news-card">
    <p className="eyebrow">{post.category} · <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time></p>
    {post.status && <span className="status-label status-label--neutral">{post.status}</span>}
    <h3><Link href={`/noticias/${post.slug}`}>{post.title}</Link></h3>
    <p>{post.excerpt}</p>
    <Link className="text-link" href={`/noticias/${post.slug}`}>Ler publicação →</Link>
    <ShareActions title={post.title} path={`/noticias/${post.slug}`} />
  </article>;
}
