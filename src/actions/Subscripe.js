export default async function Subscripe(email) {
  const host = process.env.NEXT_PUBLIC_URL

  try {
    const res = await fetch(`${host}/api/Subscripe`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        Email: email,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      return {
        success: false,
        message: data?.errors?.[0]?.message || 'Something went wrong',
      }
    }

    return {
      success: true,
      message: data?.message,
    }
  } catch (err) {
    return {
      success: false,
      message: err.message,
    }
  }
}
