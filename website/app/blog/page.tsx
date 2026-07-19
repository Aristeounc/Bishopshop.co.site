import { getAllBlogPosts } from '@/blog';
import { Badge } from '@/components/ui/Badge';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import Link from 'next/link';

export const metadata = {
  title: 'Blog — Refutation',
  description: 'Tips, techniques, and insights for mastering difficult conversations.',
};

export default function BlogPage() {
  const posts = getAllBlogPosts();
  const categories = [...new Set(posts.map((p) => p.category))];

  return (
    <>
      <Header />
      <main className="min-h-screen pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="mb-16">
            <Badge variant="primary" className="mb-4">
              Blog
            </Badge>
            <h1 className="text-5xl lg:text-6xl font-bold mb-4">Learning Center</h1>
            <p className="text-xl text-slate-300">
              Tips, techniques, and insights for mastering difficult conversations.
            </p>
          </div>

          {/* Posts grid */}
          <div className="space-y-8">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group block bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-brand-accent transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="primary">{post.category}</Badge>
                    <span className="text-sm text-slate-400">
                      {post.readTime} min read
                    </span>
                  </div>
                  <time className="text-sm text-slate-400">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                </div>

                <h2 className="text-2xl font-bold mb-2 group-hover:text-brand-accent transition-colors">
                  {post.title}
                </h2>
                <p className="text-slate-300 mb-4">{post.description}</p>

                <div className="flex items-center gap-2 text-brand-accent font-semibold">
                  Read More <span className="group-hover:translate-x-2 transition-transform">→</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty state */}
          {posts.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">No blog posts yet. Check back soon!</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
