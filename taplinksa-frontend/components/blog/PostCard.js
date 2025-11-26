import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function PostCard({ post }) {
  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url || '/placeholder-blog.jpg';
  const author = post._embedded?.author?.[0];
  const date = new Date(post.date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <motion.article
      whileHover={{ y: -8 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group"
    >
      <Link href={`/blog/${post.slug}`}>
        <div className="relative aspect-video overflow-hidden bg-gray-100">
          <Image
            src={featuredImage}
            alt={post.title.rendered}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </div>

        <div className="p-6">
          <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
            {author && <span>{author.name}</span>}
            <span>•</span>
            <time dateTime={post.date}>{date}</time>
          </div>

          <h3
            className="text-2xl font-bold mb-3 group-hover:text-gold transition-colors line-clamp-2"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          <div
            className="text-gray-600 mb-4 line-clamp-3"
            dangerouslySetInnerHTML={{ __html: post.excerpt.rendered }}
          />

          <motion.span
            whileHover={{ x: -5 }}
            className="text-gold font-bold inline-flex items-center gap-2"
          >
            اقرأ المزيد ←
          </motion.span>
        </div>
      </Link>
    </motion.article>
  );
}
