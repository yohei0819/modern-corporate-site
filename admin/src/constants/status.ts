export const APPLICATION_STATUS_MAP = {
  unread: { label: '未読', color: 'blue' as const, hex: '#3b82f6' },
  reviewing: { label: '選考中', color: 'amber' as const, hex: '#f59e0b' },
  interviewing: { label: '面接中', color: 'purple' as const, hex: '#8b5cf6' },
  accepted: { label: '採用', color: 'green' as const, hex: '#10b981' },
  rejected: { label: '不採用', color: 'red' as const, hex: '#ef4444' },
} as const;

export const APPLICATION_STATUS_OPTIONS = [
  { value: 'reviewing', label: '選考中' },
  { value: 'interviewing', label: '面接中' },
  { value: 'accepted', label: '採用' },
  { value: 'rejected', label: '不採用' },
] as const;

export const INQUIRY_STATUS_MAP = {
  unread: { label: '未読', color: 'blue' as const, hex: '#3b82f6' },
  replied: { label: '返信済', color: 'green' as const, hex: '#10b981' },
} as const;

export const INQUIRY_STATUS_OPTIONS = [{ value: 'replied', label: '返信済' }] as const;

export const CONTENT_STATUS_MAP = {
  draft: { label: '下書き', color: 'gray' as const },
  published: { label: '公開中', color: 'green' as const },
} as const;

export const NEWS_CATEGORY_MAP: Record<
  string,
  { label: string; color: 'blue' | 'purple' | 'amber' }
> = {
  info: { label: 'お知らせ', color: 'blue' },
  press: { label: 'プレスリリース', color: 'purple' },
  event: { label: 'イベント', color: 'amber' },
  blog: { label: 'ブログ', color: 'blue' },
};
