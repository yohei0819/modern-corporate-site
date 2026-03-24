<!DOCTYPE html>
<html lang="ja">
<body>
<p>新しい応募がありました。</p>
<hr>
<p><strong>応募職種:</strong> {{ $application->jobPosting?->title }}</p>
<p><strong>お名前:</strong> {{ $application->name }}</p>
<p><strong>メールアドレス:</strong> {{ $application->email }}</p>
<p><strong>電話番号:</strong> {{ $application->phone }}</p>
<p><strong>年齢:</strong> {{ $application->age ?? '未記入' }}</p>
<p><strong>メッセージ:</strong></p>
<p>{{ $application->message ?? 'なし' }}</p>
<hr>
<p>管理画面から詳細を確認してください。</p>
</body>
</html>
