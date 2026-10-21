/**
 * Typographic intro. Pure CSS: it never waits for JavaScript and never blocks
 * the page — content renders underneath and the overlay wipes away after ~1.3s.
 * An inline script in <head> (see INTRO_SCRIPT) hides it for the rest of the
 * browser session, and it is skipped entirely for reduced-motion users.
 */
export const INTRO_SCRIPT = `try{if(sessionStorage.getItem('ml-intro')==='1'){document.documentElement.setAttribute('data-intro-seen','')}else{sessionStorage.setItem('ml-intro','1')}}catch(e){}`;

export default function LoadingScreen() {
  return (
    <div aria-hidden className="intro-overlay fixed inset-0 z-[100] flex items-center justify-center bg-navy-deep">
      <div className="flex flex-col items-center gap-5">
        <svg width="220" height="2" viewBox="0 0 220 2" className="overflow-visible">
          <line x1="0" y1="1" x2="220" y2="1" stroke="#c9a24d" strokeWidth="1" className="draw-path animate-draw [--len:220]" />
        </svg>
        <span className="reveal-line">
          <span className="animate-rise font-serif text-4xl tracking-[0.18em] text-white md:text-5xl">MONIKA LUXE</span>
        </span>
        <span className="eyebrow animate-fade text-gold-light [animation-delay:400ms]">Interiors &amp; Construction</span>
      </div>
    </div>
  );
}
