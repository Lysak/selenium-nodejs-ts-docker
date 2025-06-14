export function getSymmetricPricePairs(basePrice: number, high: number, low: number) {
    const startPct = 0.00005;  // 0.005%
    const endPct = 0.00075;   // 0.075%
    const step = 0.00005;     // 0.005%

    const truncate5 = (n: number): number => Number(n.toFixed(5));

    const midPrice = (high: number, low: number): number =>
        truncate5((high + low) / 2);

    const percentLabel = (p: number): string =>
        `${p >= 0 ? '+' : ''}${(p * 100).toFixed(3)}%`;

    const negatives: [string, number][] = [];
    const positives: [string, number][] = [];

    for (let pct = startPct; pct <= endPct; pct += step) {
        negatives.push([percentLabel(-pct), truncate5(basePrice * (1 - pct))]);
        positives.push([percentLabel(pct), truncate5(basePrice * (1 + pct))]);
    }

    negatives.sort(([a], [b]) => parseFloat(b) - parseFloat(a));

    const combined: [string, number][] = [
        ...negatives,
        ['-0.000%', 0],
        ...positives
    ];

    const pairs: { [key: string]: number } = {};
    for (const [label, value] of combined) {
        pairs[label] = value;
    }

    return {
        midPrice: midPrice(high, low),
        basePrice: truncate5(basePrice),
        pairs
    };
}
