import Image from 'next/image'
import Link from 'next/link'

const NoteCards = ({ item, locale }) => {
  const formattedDate = new Date(item.createdAt).toLocaleDateString(
    locale === 'ar' ? 'ar-EG' : 'en-GB',
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    },
  )
  return (
    <div className="flex flex-col justify-center gap-2 w-fit bg-base-light rounded-lg p-4 text-base-dark">
      <div className="flex relative justify-center items-center">
        <Image
          src={item.ImageSource === 'Url' ? item.ImageUrl : item.image?.image}
          alt="image"
          width={350}
          height={350}
          className="object-contain rounded-lg"
        />
        <div className="absolute inset-0 top-0 left-0">
          <div className="absolute top-2 left-2">
            <span className="bg-base-light  font-semibold text-sm px-2  rounded-full shadow-sm">
              {formattedDate}
            </span>
          </div>
        </div>
      </div>
      <p className="font-semibold">{locale === 'en' ? item.brandName : item.brandNameAr}</p>
      <p className="font-bold">{locale === 'en' ? item.title : item.titleAr}</p>
      <p className="text-sm">{locale === 'en' ? item.des : item.desAr}</p>
      <Link
        href={`/${locale}/blogs/${item.id}`}
        className="text-base font-semibold hover:text-base-coffe underline transition-all duration-300"
      >
        {locale === 'en' ? 'Read More' : 'اقراء المزيد'}
      </Link>
    </div>
  )
}

export default NoteCards
