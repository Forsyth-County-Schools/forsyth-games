'use client'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-surface-hover mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <p className="text-textSecondary">
            <span className="font-semibold">a site by</span>{' '}
            <a 
              href="https://dsc.gg/parcoil" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:text-white transition-colors font-semibold"
            >
              parcoil network
            </a>
          </p>
          <p className="text-textSecondary text-sm mt-2">
            © 2024 Forsyth Games. All games remain property of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  )
}
