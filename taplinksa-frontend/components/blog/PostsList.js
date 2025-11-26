import PostCard from './PostCard';

export default function PostsList({ posts }) {
  if (!posts || posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 text-lg">لا توجد مقالات متاحة حالياً</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {posts.map((post, index) => (
        <div key={post.id} data-aos="fade-up" data-aos-delay={index * 50}>
          <PostCard post={post} />
        </div>
      ))}
    </div>
  );
}
