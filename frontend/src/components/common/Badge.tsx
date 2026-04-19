import { newsCategoryColors, newsCategoryLabels } from '@/lib/constants';

export default function Badge({ category }: { category: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
        newsCategoryColors[category] || 'bg-gray-100 text-gray-800'
      }`}
    >
      {newsCategoryLabels[category] || category}
    </span>
  );
}
