function Footer() {
  return (
    <footer className="w-full bg-primary-main text-primary-text py-4">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p className="text-sm mb-2">
          This site is a fan project and is not affiliated with or endorsed by MICA Team. All game
          assets © MICA Team (Sunborn Network Technology).
        </p>
        <p className="text-sm">
          Powered by:{' '}
          <a
            href="https://react.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-text underline hover:text-link-hover transition-colors"
          >
            React
          </a>{' '}
          <a
            href="https://vite.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-text underline hover:text-link-hover transition-colors"
          >
            Vite
          </a>{' '}
          <a
            href="https://tailwindcss.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-text underline hover:text-link-hover transition-colors"
          >
            Tailwind
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
