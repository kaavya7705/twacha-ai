import Link from "next/link"

const blogPosts = [
  {
    id: 1,
    title: "5 Essential Skincare Tips for Radiant Skin",
    excerpt: "Discover the key steps to achieve a glowing complexion...",
    date: "June 15, 2023",
  },
  {
    id: 2,
    title: "Understanding Different Skin Types",
    excerpt: "Learn how to identify your skin type and choose the right products...",
    date: "June 22, 2023",
  },
  {
    id: 3,
    title: "The Benefits of Regular Facials",
    excerpt: "Explore how professional facials can transform your skin...",
    date: "June 29, 2023",
  },
]

export default function Blog() {
  return (
    <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Face Health Blog</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <div key={post.id} className="card border border-gray-300 rounded-lg overflow-hidden shadow-lg">
            <div className="card-header bg-gray-100 px-4 py-2">
              <h2 className="text-xl font-semibold text-gray-800">{post.title}</h2>
            </div>
            <div className="card-content px-4 py-2">
              <p className="text-gray-600">{post.excerpt}</p>
            </div>
            <div className="card-footer flex justify-between items-center px-4 py-2 bg-gray-50">
              <span className="text-sm text-gray-500">{post.date}</span>
              <Link href={`/blog/${post.id}`}>
                <a className="text-pink-600 hover:underline">Read more</a>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
