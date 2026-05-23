import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-stone-200 mt-24 bg-[#fafaf8]">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <span className="font-serif tracking-[0.3em] text-base text-stone-900 uppercase block mb-3">
            Mensah
          </span>
          <p className="text-xs text-stone-400 leading-relaxed max-w-[20ch]">
            Tailored for the occasion. Accra, Ghana.
          </p>
        </div>

        {/* Shop */}
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-stone-400 mb-4">Shop</p>
          <ul className="space-y-2.5">
            <li>
              <Link href="/shop" className="text-xs text-stone-600 hover:text-stone-900 transition-colors tracking-wide">
                The Collection
              </Link>
            </li>
            <li>
              <Link href="/campaigns" className="text-xs text-stone-600 hover:text-stone-900 transition-colors tracking-wide">
                Campaigns
              </Link>
            </li>
          </ul>
        </div>

        {/* Order */}
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-stone-400 mb-4">Order</p>
          <ul className="space-y-2.5">
            <li>
              <span className="text-xs text-stone-600 tracking-wide">WhatsApp Checkout</span>
            </li>
            <li>
              <span className="text-xs text-stone-600 tracking-wide">Bespoke Tailoring</span>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <p className="text-[10px] tracking-[0.4em] uppercase text-stone-400 mb-4">Contact</p>
          <ul className="space-y-2.5">
            <li>
              <a
                href="https://wa.me/233551856093"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-stone-600 hover:text-stone-900 transition-colors tracking-wide"
              >
                WhatsApp
              </a>
            </li>
            <li>
              <span className="text-xs text-stone-600 tracking-wide">Accra, Ghana</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-stone-100 max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-2">
        <p className="text-[11px] text-stone-400 tracking-widest uppercase">
          © {new Date().getFullYear()} Mensah Atelier
        </p>
        <p className="text-[11px] text-stone-300 tracking-wider">
          Tailored for the Occasion
        </p>
      </div>
    </footer>
  )
}
