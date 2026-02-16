export function formatVNDText(value?: number | null): string {
    if (value === null || value === undefined) return '0 VND';

    return new Intl.NumberFormat('vi-VN').format(value);
}
