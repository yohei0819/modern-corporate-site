<?php

namespace App\Enums;

enum EmploymentType: string
{
    case FullTime = 'full-time';
    case Contract = 'contract';
    case PartTime = 'part-time';
    case Internship = 'internship';

    public static function values(): array
    {
        return array_column(self::cases(), 'value');
    }

    public static function rule(): string
    {
        return 'in:' . implode(',', self::values());
    }
}
