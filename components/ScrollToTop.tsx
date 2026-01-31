'use client'

import { useEffect } from 'react'

export default function ScrollToTop() {
  useEffect(() => {
    // Scroll to top on page load
    window.scrollTo(0, 0)
    
    // Handle browser back/forward buttons
    const handlePopState = () => {
      window.scrollTo(0, 0)
    }
    
    window.addEventListener('popstate', handlePopState)
    
    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [])

  return null
}
