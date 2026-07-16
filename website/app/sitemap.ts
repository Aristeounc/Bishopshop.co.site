import { MetadataRoute } from 'next';
import { getAllBlogPosts } from '@/blog';

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts = getAllBlogPosts();

  const blogUrls: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `https://bishopshop.co.site/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    {
      url: 'https://bishopshop.co.site',
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: 'https://bishopshop.co.site/blog',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...blogUrls,
  ];
}
