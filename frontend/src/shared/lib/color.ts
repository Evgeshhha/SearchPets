export function contrastText(hex: string): '#000000' | '#ffffff' {
    const match = /^#([0-9a-f]{6})$/i.exec(hex);
    if (!match) return '#ffffff';
    const value = parseInt(match[1], 16);
    const [r, g, b] = [(value >> 16) & 255, (value >> 8) & 255, value & 255];
    return (r * 299 + g * 587 + b * 114) / 1000 > 150 ? '#000000' : '#ffffff';
}
