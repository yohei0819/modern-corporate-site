<?php

namespace App\Enums;

enum NewsCategory: string
{
    case Info = 'info';
    case Press = 'press';
    case Event = 'event';
    case Blog = 'blog';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function rule(): string
    {
        return 'in:' . implode(',', self::values());
    }
}
