import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  readTime: number;
  content: string;
}

export function getAllBlogPosts(): BlogPost[] {
  const files = fs.readdirSync(postsDirectory);
  
  const posts = files.map((file) => {
    const filePath = path.join(postsDirectory, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      slug: file.replace(/\.md$/, ''),
      title: data.title,
      description: data.description,
      date: data.date,
      author: data.author,
      category: data.category,
      readTime: data.readTime,
      content,
    };
  });

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getBlogPost(slug: string): BlogPost | null {
  try {
    const filePath = path.join(postsDirectory, `${slug}.md`);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title,
      description: data.description,
      date: data.date,
      author: data.author,
      category: data.category,
      readTime: data.readTime,
      content,
    };
  } catch {
    return null;
  }
}
