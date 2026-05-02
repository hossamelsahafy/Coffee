export default async function GetAllData(slug) {
  try {
    const url = process.env.NEXT_PUBLIC_URL

    const res = await fetch(`${url}/api/${slug}?pagination=false&depth=1`, {
      cache: 'no-store',
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status}`)
    }

    const data = await res.json()

    return data.docs
  } catch (error) {
    console.error('GetAllData error:', error)
    return null
  }
}
