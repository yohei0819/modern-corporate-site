interface SectionTitleProps {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center';
}

export default function SectionTitle({ title, subtitle, align = 'center' }: SectionTitleProps) {
  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-lg text-gray-500">{subtitle}</p>
      )}
      <div
        className={`mt-4 h-1 w-16 rounded bg-primary ${
          align === 'center' ? 'mx-auto' : ''
        }`}
      />
    </div>
  );
}
