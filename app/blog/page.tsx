import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

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
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Face Health Blog</h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {blogPosts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">{post.excerpt}</p>
            </CardContent>
            <CardFooter className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{post.date}</span>
              <Link href={`/blog/${post.id}`} className="text-pink-600 hover:underline">
                Read more
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

