export type NewsPost = {
  slug: string;
  title: string;
  category: string;
  publishedAt: string;
  excerpt: string;
  closesAt?: string;
  eventDate?: string;
  source: string;
  sourceLabel: string;
  actionHref: string;
  actionLabel: string;
  sections: { title: string; text: string }[];
};

export type NewsPreview = Pick<NewsPost, "slug" | "title" | "category" | "publishedAt" | "excerpt"> & { status?: string };

export function newsStatus(post: NewsPost, now = new Date()) {
  if (post.closesAt) return now.getTime() >= new Date(post.closesAt).getTime() ? "Prazo publicado encerrado" : "Consulte o prazo e o edital";
  if (post.eventDate) return now.getTime() >= new Date(`${post.eventDate}T00:00:00-03:00`).getTime() + 86_400_000 ? "Evento com data passada" : "Agenda prevista";
}

export function newsPreviews(posts: NewsPost[], now = new Date()): NewsPreview[] {
  return posts.map(post => ({ slug: post.slug, title: post.title, category: post.category, publishedAt: post.publishedAt, excerpt: post.excerpt, status: newsStatus(post, now) }));
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" }).format(new Date(date));
}
