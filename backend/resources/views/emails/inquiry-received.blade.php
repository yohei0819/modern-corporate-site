<!DOCTYPE html>
<html lang="ja">
<body>
<p>新しい問い合わせがありました。</p>
<hr>
<p><strong>お名前:</strong> {{ $inquiry->name }}</p>
<p><strong>メールアドレス:</strong> {{ $inquiry->email }}</p>
<p><strong>会社名:</strong> {{ $inquiry->company ?? '未記入' }}</p>
<p><strong>お問い合わせ内容:</strong></p>
<p>{{ $inquiry->message }}</p>
<hr>
<p>管理画面から詳細を確認してください。</p>
</body>
</html>
