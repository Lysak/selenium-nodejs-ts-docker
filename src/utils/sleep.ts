export function randomDelay(intMin: number = 50, intMax: number = 150) {
    return Math.floor(Math.random() * (intMax - intMin + 1) + intMin);
}

export function sleep(ms: number = 1000, intMin: number = 500, intMax: number = 1500): Promise<void> {
    const msRandomDelay = randomDelay(intMin, intMax);

    const totalDelay = Math.floor(ms) + msRandomDelay;

    // console.log(`Sleeping for ${totalDelay}ms (base: ${ms}, random: ${msRandomDelay})`, `"lysak"`);

    return new Promise(res => setTimeout(res, totalDelay));
}
