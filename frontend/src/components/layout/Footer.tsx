import Link from 'next/link';

const footerNav = [
  {
    title: '企業情報',
    links: [
      { href: '/about', label: '会社紹介' },
      { href: '/business', label: '事業紹介' },
      { href: '/culture', label: '働く環境' },
    ],
  },
  {
    title: '採用情報',
    links: [
      { href: '/jobs', label: '募集職種' },
      { href: '/members', label: '社員紹介' },
      { href: '/entry', label: 'エントリー' },
    ],
  },
  {
    title: 'その他',
    links: [
      { href: '/news', label: 'お知らせ' },
      { href: '/faq', label: 'FAQ' },
      { href: '/contact', label: 'お問い合わせ' },
      { href: '/privacy', label: 'プライバシーポリシー' },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-gray-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="text-2xl font-bold text-white">
              CORP.
            </Link>
            <p className="mt-3 text-sm leading-relaxed">
              テクノロジーで未来を創る。
              <br />
              私たちと一緒に働きませんか？
            </p>
          </div>

          {/* Nav columns */}
          {footerNav.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
                {section.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-gray-800 pt-6 text-center text-xs text-gray-500">
          &copy; {new Date().getFullYear()} CORP. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
