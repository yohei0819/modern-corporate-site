'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import type { ApplicationFormData } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export default function EntryForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<'input' | 'confirm' | 'sending'>('input');
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [jobs, setJobs] = useState<{ id: number; title: string }[]>([]);
  const [form, setForm] = useState<ApplicationFormData>({
    job_id: Number(searchParams.get('job')) || 0,
    name: '',
    email: '',
    phone: '',
    age: null,
    message: '',
    resume: null,
    portfolio_url: '',
  });

  useEffect(() => {
    fetch(`${API_URL}/api/jobs`)
      .then((res) => res.json())
      .then((data) => setJobs(data.data?.map((j: { id: number; title: string }) => ({ id: j.id, title: j.title })) || []))
      .catch(() => {});
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'age' ? (value ? Number(value) : null) : name === 'job_id' ? Number(value) : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, resume: e.target.files?.[0] || null }));
  };

  const validate = (): boolean => {
    const errs: Record<string, string[]> = {};
    if (!form.job_id) errs.job_id = ['応募する職種を選択してください'];
    if (!form.name.trim()) errs.name = ['名前を入力してください'];
    if (!form.email.trim()) errs.email = ['メールアドレスを入力してください'];
    if (!form.phone.trim()) errs.phone = ['電話番号を入力してください'];
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) setStep('confirm');
  };

  const handleSubmit = async () => {
    setStep('sending');
    const formData = new FormData();
    formData.append('job_id', String(form.job_id));
    formData.append('name', form.name);
    formData.append('email', form.email);
    formData.append('phone', form.phone);
    if (form.age) formData.append('age', String(form.age));
    if (form.message) formData.append('message', form.message);
    if (form.resume) formData.append('resume', form.resume);
    if (form.portfolio_url) formData.append('portfolio_url', form.portfolio_url);

    try {
      const res = await fetch(`${API_URL}/api/applications`, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json();
        setErrors(body.errors || {});
        setStep('input');
        return;
      }
      router.push('/entry/thanks');
    } catch {
      setErrors({ submit: ['送信に失敗しました。もう一度お試しください。'] });
      setStep('input');
    }
  };

  const selectedJob = jobs.find((j) => j.id === form.job_id);

  if (step === 'confirm') {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-bold text-gray-900">入力内容の確認</h2>
        <p className="text-sm text-gray-500">以下の内容でよろしければ「送信する」を押してください。</p>

        <dl className="divide-y divide-gray-100">
          {[
            ['応募職種', selectedJob?.title || '—'],
            ['お名前', form.name],
            ['メールアドレス', form.email],
            ['電話番号', form.phone],
            ['年齢', form.age ? `${form.age}歳` : '—'],
            ['自己PR・メッセージ', form.message || '—'],
            ['履歴書', form.resume?.name || '—'],
            ['ポートフォリオURL', form.portfolio_url || '—'],
          ].map(([label, value]) => (
            <div key={label} className="py-3 sm:flex sm:gap-4">
              <dt className="text-sm font-medium text-gray-500 sm:w-40">{label}</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 break-all">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setStep('input')}
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            戻って修正する
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={step === 'sending' as never}
            className="rounded-lg bg-primary px-8 py-2.5 text-sm font-bold text-white hover:bg-primary-dark disabled:opacity-50"
          >
            送信する
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleConfirm} className="space-y-6">
      {errors.submit && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">{errors.submit[0]}</div>
      )}

      <div>
        <label htmlFor="job_id" className="block text-sm font-medium text-gray-700">
          応募する職種 <span className="text-red-500">*</span>
        </label>
        <select
          id="job_id"
          name="job_id"
          value={form.job_id}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
        >
          <option value={0}>選択してください</option>
          {jobs.map((j) => (
            <option key={j.id} value={j.id}>{j.title}</option>
          ))}
        </select>
        {errors.job_id && <p className="mt-1 text-xs text-red-500">{errors.job_id[0]}</p>}
      </div>

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          お名前 <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          value={form.name}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name[0]}</p>}
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
        />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email[0]}</p>}
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          電話番号 <span className="text-red-500">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
        />
        {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone[0]}</p>}
      </div>

      <div>
        <label htmlFor="age" className="block text-sm font-medium text-gray-700">年齢</label>
        <input
          id="age"
          name="age"
          type="number"
          min={18}
          max={65}
          value={form.age ?? ''}
          onChange={handleChange}
          className="mt-1 block w-32 rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          自己PR・メッセージ
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={handleChange}
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div>
        <label htmlFor="resume" className="block text-sm font-medium text-gray-700">
          履歴書（PDF / DOC / DOCX, 最大5MB）
        </label>
        <input
          id="resume"
          name="resume"
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={handleFileChange}
          className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-medium file:text-primary hover:file:bg-blue-100"
        />
      </div>

      <div>
        <label htmlFor="portfolio_url" className="block text-sm font-medium text-gray-700">
          ポートフォリオURL
        </label>
        <input
          id="portfolio_url"
          name="portfolio_url"
          type="url"
          value={form.portfolio_url}
          onChange={handleChange}
          placeholder="https://"
          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <button
        type="submit"
        className="rounded-lg bg-primary px-8 py-3 text-sm font-bold text-white hover:bg-primary-dark transition-colors"
      >
        確認画面へ
      </button>
    </form>
  );
}
