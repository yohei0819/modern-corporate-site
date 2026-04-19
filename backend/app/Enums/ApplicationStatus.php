<?php

namespace App\Enums;

enum ApplicationStatus: string
{
    case Unread = 'unread';
    case Reviewing = 'reviewing';
    case Interviewing = 'interviewing';
    case Accepted = 'accepted';
    case Rejected = 'rejected';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function rule(): string
    {
        return 'in:' . implode(',', self::values());
    }
}
