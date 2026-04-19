<?php

namespace App\Enums;

enum InquiryStatus: string
{
    case Unread = 'unread';
    case Replied = 'replied';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function rule(): string
    {
        return 'in:' . implode(',', self::values());
    }
}
