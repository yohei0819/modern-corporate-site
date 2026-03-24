const categoryColors: Record<string, string> = {
  info: 'bg-blue-100 text-blue-800',
  press: 'bg-purple-100 text-purple-800',
  event: 'bg-green-100 text-green-800',
  blog: 'bg-amber-100 text-amber-800',
};

const categoryLabels: Record<string, string> = {
  info: 'お知らせ',
  press: 'プレスリリース',
  event: 'イベント',
  blog: 'ブログ',
};

export default function Badge({ category }: { category: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        categoryColors[category] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {categoryLabels[category] || category}
    </span>
  );
}
