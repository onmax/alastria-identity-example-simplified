export function add0x(hex: string): string {
    return hex.slice(0, 2) === '0x' ? hex : `0x${hex}`;
}