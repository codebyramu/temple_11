import Link from 'next/link';

export function NavBar() {
  return (
    <nav className="divine-nav">
      <div className="divine-nav-container">
        <Link href="/" className="divine-nav-logo">Divine Street</Link>
        <div className="divine-nav-links">
          <Link href="#about">About</Link>
          <Link href="/bhaskararaya">Bhaskararaya</Link>
          <Link href="/temples">Temples</Link>
          <Link href="/contact">Contact</Link>
        </div>
      </div>
    </nav>
  );
}
