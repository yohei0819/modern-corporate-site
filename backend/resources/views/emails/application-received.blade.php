<!DOCTYPE html>
<html lang="ja">
<body>
<p>{{ $application->name }} 様</p>
<p>この度はご応募いただき、誠にありがとうございます。</p>
<p>以下の内容で応募を受け付けました。</p>
<hr>
<p><strong>応募職種:</strong> {{ $application->jobPosting?->title }}</p>
<p><strong>お名前:</strong> {{ $application->name }}</p>
<p><strong>メールアドレス:</strong> {{ $application->email }}</p>
<p><strong>電話番号:</strong> {{ $application->phone }}</p>
<hr>
<p>書類選考の結果は、追ってご連絡いたします。</p>
<p>今しばらくお待ちください。</p>
</body>
</html>
