import { Swiper, SwiperSlide } from 'swiper/react'
import { Pagination } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import BlogCard from './BlogCard'

const BlogsSwiper = ({ filteredBlogs, locale }) => {
  if (!filteredBlogs?.length) return null

  const grouped = filteredBlogs.reduce((acc, _, i) => {
    if (i % 2 === 0) acc.push(filteredBlogs.slice(i, i + 2))
    return acc
  }, [])

  return (
    <Swiper
      slidesPerView={1}
      spaceBetween={20}
      pagination={{
        clickable: true,
        dynamicBullets: false,
      }}
      modules={[Pagination]}
      className="w-full h-auto pb-12"
      style={{ paddingBottom: '3rem' }}
    >
      {grouped.map((pair, index) => (
        <SwiperSlide key={index}>
          <div className="flex flex-col gap-4">
            {pair.map((blog) => (
              <BlogCard key={blog.id} blog={blog} locale={locale} />
            ))}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default BlogsSwiper
