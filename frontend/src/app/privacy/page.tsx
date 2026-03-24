import Breadcrumb from '@/components/layout/Breadcrumb';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'プライバシーポリシー',
  description: 'CORP.のプライバシーポリシーについてご説明します。',
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb items={[{ label: 'プライバシーポリシー' }]} />

      <h1 className="text-3xl font-bold text-gray-900">プライバシーポリシー</h1>

      <div className="mt-8 prose prose-gray max-w-none text-sm">
        <p>
          株式会社CORP.（以下「当社」）は、個人情報の保護に関する法律（以下「個人情報保護法」）を遵守し、
          以下のプライバシーポリシーに従い個人情報を適切に取り扱います。
        </p>

        <h2>1. 個人情報の取得</h2>
        <p>
          当社は、採用活動およびお問い合わせ対応のため、以下の個人情報を取得します。
        </p>
        <ul>
          <li>氏名、メールアドレス、電話番号、住所</li>
          <li>学歴、職歴、保有資格</li>
          <li>当社ウェブサイトの閲覧履歴（Cookie情報含む）</li>
        </ul>

        <h2>2. 個人情報の利用目的</h2>
        <p>取得した個人情報は、以下の目的で利用します。</p>
        <ul>
          <li>採用選考の実施および連絡</li>
          <li>お問い合わせへの回答</li>
          <li>サービスの改善および統計データの作成</li>
          <li>法令に基づく対応</li>
        </ul>

        <h2>3. 個人情報の第三者提供</h2>
        <p>
          当社は、法令に基づく場合を除き、本人の同意なく個人情報を第三者に提供することはありません。
        </p>

        <h2>4. 個人情報の安全管理</h2>
        <p>
          当社は、個人情報の漏洩、滅失またはき損を防止するため、適切な安全管理措置を講じます。
        </p>

        <h2>5. 個人情報の開示・訂正・削除</h2>
        <p>
          ご本人から個人情報の開示、訂正、削除等のご請求があった場合、
          本人確認を行った上で速やかに対応いたします。
        </p>

        <h2>6. Cookie の利用</h2>
        <p>
          当社ウェブサイトでは、ユーザー体験の向上のためCookieを使用しています。
          ブラウザの設定によりCookieの受け入れを拒否することも可能ですが、
          一部のサービスが正常に動作しない場合があります。
        </p>

        <h2>7. お問い合わせ</h2>
        <p>
          本ポリシーに関するお問い合わせは、以下までお願いいたします。
        </p>
        <p>
          株式会社CORP. 個人情報管理担当
          <br />
          メール: privacy@corp-example.co.jp
        </p>

        <p className="text-gray-400 mt-10">制定日: 2025年4月1日</p>
      </div>
    </div>
  );
}
