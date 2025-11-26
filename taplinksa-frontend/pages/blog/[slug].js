import Image from 'next/image';
import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import { getPosts, getPostBySlug } from '@/lib/api';

export default function BlogPost({ post }) {
  if (!post) {
    return (
      <Layout title="المقال غير موجود">
        <div className="container-custom section-padding text-center">
          <h1 className="text-4xl font-bold">المقال غير موجود</h1>
        </div>
      </Layout>
    );
  }

  const featuredImage = post._embedded?.['wp:featuredmedia']?.[0]?.source_url;
  const author = post._embedded?.author?.[0];
  const date = new Date(post.date).toLocaleDateString('ar-SA', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <Layout
      title={`${post.title.rendered} | مدونة تاب لينك`}
      description={post.excerpt.rendered?.replace(/<[^>]*>/g, '').substring(0, 160)}
    >
      <article className="container-custom section-padding">
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="text-gray-600 hover:text-gold">الرئيسية</a></li>
            <li className="text-gray-400">/</li>
            <li><a href="/blog" className="text-gray-600 hover:text-gold">المدونة</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-gold font-bold">{post.title.rendered}</li>
          </ol>
        </nav>

        <motion.header
          className="max-w-4xl mx-auto mb-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1
            className="text-4xl md:text-5xl font-bold mb-6"
            dangerouslySetInnerHTML={{ __html: post.title.rendered }}
          />

          <div className="flex items-center justify-center gap-6 text-gray-600 mb-8">
            {author && <span>بواسطة {author.name}</span>}
            <span>•</span>
            <time dateTime={post.date}>{date}</time>
          </div>

          {featuredImage && (
            <div className="relative aspect-video rounded-2xl overflow-hidden">
              <Image
                src={featuredImage}
                alt={post.title.rendered}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}
        </motion.header>

        <motion.div
          className="wp-content prose prose-lg max-w-4xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />
      </article>
    </Layout>
  );
}

export async function getStaticPaths() {
  const { posts } = await getPosts(1, 100);

  const paths = posts.map((post) => ({
    params: { slug: post.slug },
  }));

  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post },
    revalidate: 60,
  };
}
