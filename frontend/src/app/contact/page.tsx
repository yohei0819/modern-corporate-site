import Breadcrumb from '@/components/layout/Breadcrumb';
import ContactForm from '@/components/forms/ContactForm';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'お問い合わせ',
  description: 'CORP.へのお問い合わせはこちらから。ご質問やご相談をお気軽にお寄せください。',
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'お問い合わせ' }]} />

      <h1 className="text-3xl font-bold text-gray-900">お問い合わせ</h1>
      <p className="mt-2 text-gray-500">
        ご質問やご相談がございましたら、下記フォームよりお気軽にお問い合わせください。
      </p>

      <div className="mt-8">
        <ContactForm />
      </div>
    </div>
  );
}
