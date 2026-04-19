<?php

namespace App\Http\Traits;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

trait HandlesFileUpload
{
    /**
     * リクエストからファイルを保存し、データ配列にパスを追加する。
     */
    protected function storeUploadedFile(
        Request $request,
        array &$data,
        string $fieldName,
        string $directory,
        string $disk = 'public',
    ): void {
        if ($request->hasFile($fieldName)) {
            $data[$fieldName] = $request->file($fieldName)->store($directory, $disk);
        }
    }

    /**
     * ファイル更新: 新ファイル保存 → モデル更新 → 旧ファイル削除。
     */
    protected function updateUploadedFile(
        Request $request,
        Model $model,
        array &$data,
        string $fieldName,
        string $directory,
        string $disk = 'public',
    ): void {
        if ($request->hasFile($fieldName)) {
            $data[$fieldName] = $request->file($fieldName)->store($directory, $disk);
            $oldPath = $model->getOriginal($fieldName);

            // 旧ファイルはモデル更新後に削除（update 内で呼ばないこと）
            if ($oldPath) {
                app()->terminating(fn () => Storage::disk($disk)->delete($oldPath));
            }
        }
    }

    /**
     * モデル削除時に関連ファイルも削除する。
     */
    protected function deleteModelFile(Model $model, string $fieldName, string $disk = 'public'): void
    {
        $path = $model->getAttribute($fieldName);
        if ($path) {
            Storage::disk($disk)->delete($path);
        }
    }
}
