import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'お問い合わせ完了',
};

export default function ContactThanksPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="text-5xl">✉️</div>
      <h1 className="mt-6 text-2xl font-bold text-gray-900">
        お問い合わせありがとうございます
      </h1>
      <p className="mt-4 text-gray-500 leading-relaxed">
        お問い合わせ内容を受け付けました。
        <br />
        担当者より2〜3営業日以内にご連絡いたします。
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex rounded-full bg-primary px-8 py-3 text-sm font-bold text-white hover:bg-primary-dark transition-colors"
      >
        トップに戻る
      </Link>
    </div>
  );
}
