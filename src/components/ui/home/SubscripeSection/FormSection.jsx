'use client'
import React, { useState, useRef } from 'react'
import Subscripe from '@/actions/Subscripe'
import { useTranslations } from 'next-intl'

const FormSection = ({ SubscripeText, placeholder, locale }) => {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState(null)
  const t = useTranslations('SubscripeForm')

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }
  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage('')
    setStatus('')
    if (!email) {
      setMessage(t('emailRequired'))
      setStatus('error')
      return
    }
    if (!validateEmail(email)) {
      setMessage(t('invalidEmail'))
      setStatus('error')
      return
    }
    try {
      setLoading(true)

      const res = await Subscripe(email)
      if (res.success) {
        setMessage(t('success'))
        setStatus('success')
        setEmail('')
      } else {
        setMessage(res.message || t('error'))
        setStatus('error')
      }
    } catch (err) {
      setMessage(t('error'))
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }
  const timeoutRef = useRef(null)
  if (timeoutRef.current) clearTimeout(timeoutRef.current)

  timeoutRef.current = setTimeout(() => {
    setMessage('')
    setStatus(null)
  }, 5000)
  return (
    <>
      <form onSubmit={handleSubmit} className="flex justify-between w-full md:w-1/2">
        <div className="flex justify-between w-full">
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={placeholder}
            className={`focus:ring-0 bg-base-light w-full ${locale === 'en' ? 'rounded-l-2xl' : 'rounded-r-2xl'} text-base-dark p-2 appearance-none focus:outline-0`}
          />
          <button
            type="submit"
            disabled={loading}
            className={`text-base-light py-3 px-6 bg-base-coffe ${locale === 'en' ? 'rounded-r-2xl' : 'rounded-l-2xl'} hover:bg-base-border transition-all duration-300 cursor-pointer`}
          >
            {loading ? (
              <span className="block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              SubscripeText
            )}
          </button>
        </div>
      </form>
      {message && (
        <p
          className={`text-sm font-semibold ${status === 'success' ? 'text-green-500' : 'text-red-500'}`}
        >
          {message}
        </p>
      )}
    </>
  )
}

export default FormSection
