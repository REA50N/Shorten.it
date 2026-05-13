export function LandingFooter() {
  return (
    <footer className="w-full border-t border-white/10 bg-slate-950 py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <span className="text-lg font-bold text-slate-100">Shorten.it</span>
          <p className="text-sm text-slate-400">
            © 2026 Shorten Beta. Simple link management.
          </p>
        </div>
        <div className="flex items-center gap-6 text-sm text-slate-400">
          <a className="hover:text-indigo-300" href="#">
            Privacy
          </a>
          <a className="hover:text-indigo-300" href="#">
            Terms
          </a>
          <a className="hover:text-indigo-300" href="#">
            Support
          </a>
        </div>
      </div>
    </footer>
  );
}
