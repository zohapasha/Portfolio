"use client";

export default function Footer() {
  const replay = () => {
    window.sessionStorage.removeItem("zp-intro-seen");
    window.location.reload();
  };

  return (
    <footer className="px-6 md:px-10 py-10 border-t border-line flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <p className="font-data text-xs text-mist">
        Zoha Pasha · {new Date().getFullYear()}
      </p>
      <div className="flex items-center gap-6">
        <button
          onClick={replay}
          className="font-data text-xs text-mist hover:text-moon transition-colors cursor-pointer"
        >
          Replay intro
        </button>
        <a
          href="#top"
          className="font-data text-xs text-mist hover:text-parchment transition-colors"
        >
          Back to top
        </a>
      </div>
    </footer>
  );
}
