'use client';

/**
 * Recent Posts Widget Plugin
 * Displays recent blog posts
 */

import React from 'react';

type Post = {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  author: string;
};

const defaultPosts: Post[] = [
  {
    id: 1,
    title: 'Getting Started with Templating',
    excerpt: 'Learn the basics of our templating system...',
    date: '2 days ago',
    author: 'John Doe',
  },
  {
    id: 2,
    title: 'Building Custom Plugins',
    excerpt: 'Create your own plugins in minutes...',
    date: '5 days ago',
    author: 'Jane Smith',
  },
  {
    id: 3,
    title: 'Theme Customization Guide',
    excerpt: 'Customize themes to match your brand...',
    date: '1 week ago',
    author: 'Bob Johnson',
  },
];

export function RecentPostsWidget({ posts = defaultPosts }: { posts?: Post[] }) {
  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold text-gray-900">
        Recent Posts
      </h3>

      <div className="space-y-3">
        {posts.map(post => (
          <div
            key={post.id}
            className="border-b pb-3 last:border-b-0 last:pb-0"
          >
            <h4 className="mb-1 font-medium text-gray-900 hover:text-blue-600">
              <button
                type="button"
                onClick={() => {}}
                className="hover:underline"
              >
                {post.title}
              </button>
            </h4>
            <p className="mb-2 text-sm text-gray-600">{post.excerpt}</p>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>{post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        className="mt-4 w-full rounded-md border border-gray-300 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        View All Posts
      </button>
    </div>
  );
}
