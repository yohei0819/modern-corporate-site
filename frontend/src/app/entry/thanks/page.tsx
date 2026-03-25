import Link from 'next/link';
import { defineMetadata } from '@/lib/metadata';

export const metadata = defineMetadata(
  'エントリー完了',
  'エントリーを受け付けました。選考結果は追ってご連絡いたします。',
  '/entry/thanks',
);

export default function EntryThanksPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-20 text-center">
      <div className="text-5xl">🎉</div>
      <h1 className="mt-6 text-2xl font-bold text-gray-900">
        ご応募ありがとうございます
      </h1>
      <p className="mt-4 text-gray-500 leading-relaxed">
        応募内容を受け付けました。
        <br />
        ご登録のメールアドレスに確認メールをお送りしましたのでご確認ください。
        <br />
        担当者より追ってご連絡いたします。
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
