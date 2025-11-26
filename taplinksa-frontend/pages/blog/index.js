import Layout from '@/components/layout/Layout';
import PostsList from '@/components/blog/PostsList';
import { getPosts } from '@/lib/api';

export default function Blog({ posts, totalPages }) {
  return (
    <Layout
      title="المدونة | تاب لينك السعودية"
      description="اقرأ أحدث المقالات حول التسويق الرقمي، بطاقات NFC، وحلول الأعمال الذكية"
    >
      <div className="container-custom section-padding">
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2">
            <li><a href="/" className="text-gray-600 hover:text-gold">الرئيسية</a></li>
            <li className="text-gray-400">/</li>
            <li className="text-gold font-bold">المدونة</li>
          </ol>
        </nav>

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" data-aos="fade-up">
            مدونة تاب لينك
          </h1>
          <div className="w-24 h-1 bg-gold mx-auto" data-aos="fade-up" data-aos-delay="100"></div>
          <p className="text-gray-600 mt-6 max-w-2xl mx-auto" data-aos="fade-up" data-aos-delay="200">
            نشارك معك أحدث الأفكار والنصائح لتطوير حضورك الرقمي
          </p>
        </div>

        <PostsList posts={posts} />
      </div>
    </Layout>
  );
}

export async function getStaticProps() {
  const { posts, totalPages } = await getPosts(1, 12);

  return {
    props: { posts, totalPages },
    revalidate: 60,
  };
}
