'use client';

export function SocialMediaWidget() {
  const posts = [
    {
      id: 1,
      image: '📸',
      caption: 'New Ventura Collection - Timeless elegance meets modern comfort',
      likes: 2847,
      comments: 142,
      link: 'https://instagram.com/brodooriginal',
    },
    {
      id: 2,
      image: '🎥',
      caption: 'Behind the scenes: Crafting perfection one stitch at a time',
      likes: 1923,
      comments: 89,
      link: 'https://instagram.com/brodooriginal',
    },
    {
      id: 3,
      image: '✨',
      caption: 'Weekend vibes with BRODO Casual Series',
      likes: 3214,
      comments: 201,
      link: 'https://instagram.com/brodooriginal',
    },
  ];

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-shadow duration-300 hover:shadow-lg">
      <div className="mb-4 space-y-2">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 p-2">
            <span className="text-white">📷</span>
          </div>
          <h3 className="text-lg font-semibold text-gray-900">@brodooriginal</h3>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>📍 Jakarta, Indonesia</span>
          <span>•</span>
          <span>👥 50K+ followers</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="group overflow-hidden rounded-lg border border-gray-200 transition-all hover:border-pink-500"
          >
            <a
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              {/* Post Image Placeholder */}
              <div className="flex aspect-square items-center justify-center bg-gradient-to-br from-purple-100 to-pink-100 transition-transform group-hover:scale-105">
                <span className="text-6xl">{post.image}</span>
              </div>

              {/* Post Info */}
              <div className="space-y-2 bg-gray-50 p-3">
                <p className="line-clamp-2 text-xs leading-relaxed">
                  {post.caption}
                </p>
                
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <span>❤️</span>
                    <span>{post.likes.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>💬</span>
                    <span>{post.comments}</span>
                  </div>
                  <span className="ml-auto transition-colors group-hover:text-pink-500">🔗</span>
                </div>
              </div>
            </a>
          </div>
        ))}

        <a
          href="https://instagram.com/brodooriginal"
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:from-purple-600 hover:to-pink-600"
        >
          <span>📷</span>
          Follow @brodooriginal
        </a>

        <p className="text-center text-[10px] text-gray-500">
          Tag kami di foto kamu dengan #BRODOStyle
        </p>
      </div>
    </div>
  );
}
