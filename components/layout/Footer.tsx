export function Footer() {
  return (
    <footer className="border-t border-stone-200 mt-24 py-12 bg-[#fafaf8]">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="font-serif tracking-[0.3em] text-sm text-stone-900 uppercase">
          Mensah
        </span>
        <p className="text-xs text-stone-400 tracking-wider">
          Tailored for the Occasion · Accra
        </p>
        <p className="text-xs text-stone-400">© {new Date().getFullYear()} Mensah Atelier</p>
      </div>
    </footer>
  )
}
