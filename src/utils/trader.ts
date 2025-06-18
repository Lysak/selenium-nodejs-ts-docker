export function getAdjustedPriceInfo(
    openPriceValue: number,
    closePriceValue: number,
    highPriceValue: number = 0,
    lowPriceValue: number = 0,
    percentageValue: number
) {
    function calculateBestPrice(priceValue: number, percentageValue: number): number {
        const decimalPercentage = percentageValue / 100;
        return truncate(priceValue + (priceValue * decimalPercentage));
    }

    function midPrice(high: number, low: number): number {
        return truncate(high + low) / 2;
    }

    return {
        openPrice: openPriceValue,
        closePrice: closePriceValue,
        highPrice: highPriceValue,
        lowPrice: lowPriceValue,
        percentage: percentageValue,

        midPrice: midPrice(highPriceValue, lowPriceValue),
        bestMidPrice: calculateBestPrice(midPrice(highPriceValue, lowPriceValue), percentageValue),
        bestPrice: calculateBestPrice(closePriceValue, percentageValue),
        openCloseMid: calculateBestPrice(midPrice(openPriceValue, closePriceValue), percentageValue),
    };
}

function truncate(n: number): number {
    return Number(n.toFixed(6));
}
