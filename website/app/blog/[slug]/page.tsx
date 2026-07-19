import { getBlogPost, getAllBlogPosts } from '@/blog';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Badge } from '@/components/ui/Badge';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const posts = getAllBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata(props: Props) {
  const params = await props.params;
  const post = getBlogPost(params.slug);

  if (!post) {
    return { title: 'Not Found' };
  }

  return {
    title: `${post.title} — Refutation Blog`,
    description: post.description,
  };
}

export default async function BlogPostPage(props: Props) {
  const params = await props.params;
  const post = getBlogPost(params.slug);

  if (!post) {
    notFound();
  }

  const allPosts = getAllBlogPosts();
  const relatedPosts = allPosts
    .filter((p) => p.category === post.category && p.slug !== post.slug)
    .slice(0, 3);

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        {/* Article header */}
        <article className="max-w-2xl mx-auto px-4">
          <div className="mb-8">
            <Link
              href="/blog"
              className="text-brand-accent hover:text-brand-primary transition-colors flex items-center gap-2"
            >
              ← Back to Blog
            </Link>
          </div>

          <header className="mb-12">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="primary">{post.category}</Badge>
              <span className="text-sm text-slate-400">{post.readTime} min read</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{post.title}</h1>

            <p className="text-xl text-slate-300 mb-6">{post.description}</p>

            <div className="flex items-center justify-between text-sm text-slate-400 border-t border-b border-slate-700 py-4">
              <span>By {post.author}</span>
              <time>
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </div>
          </header>

          {/* Article content */}
          <div className="prose prose-invert max-w-none mb-16">
            {/* Render markdown content as HTML */}
            <div
              className="space-y-6 text-slate-300"
              dangerouslySetInnerHTML={{
                __html: post.content
                  .replace(/^### (.*?)$/gm, '<h3 class="text-2xl font-bold text-white mt-8 mb-4">$1</h3>')
                  .replace(/^## (.*?)$/gm, '<h2 class="text-3xl font-bold text-white mt-8 mb-4">$1</h2>')
                  .replace(/^# (.*?)$/gm, '<h1 class="text-4xl font-bold text-white mt-8 mb-4">$1</h1>')
                  .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
                  .replace(/\*(.*?)\*/g, '<em>$1</em>')
                  .replace(/^- (.*?)$/gm, '<li class="ml-4">$1</li>')
                  .replace(/^([A-Z][^:\n]*):$/gm, '<strong class="text-white">$1:</strong>')
                  .replace(/\n\n/g, '</p><p>')
                  .replace(/^/gm, '<p>')
                  .replace(/$/gm, '</p>'),
              }}
            />
          </div>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div className="border-t border-slate-700 pt-12">
              <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link
                    key={relatedPost.slug}
                    href={`/blog/${relatedPost.slug}`}
                    className="group bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:border-brand-accent transition-all"
                  >
                    <h4 className="font-bold mb-2 group-hover:text-brand-accent transition-colors">
                      {relatedPost.title}
                    </h4>
                    <p className="text-sm text-slate-400">{relatedPost.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </article>
      </main>
      <Footer />
    </>
  );
}
