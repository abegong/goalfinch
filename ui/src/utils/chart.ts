import * as d3 from 'd3';

export function getDatesInCurrentMonth() {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dates = [];
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateString = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
        dates.push({ date: dateString });
    }
    return dates;
}

export function roundToDigits(n: number, digits: number): number {
    const divisor = Math.pow(10, digits);
    return Math.round(n / divisor) * divisor;
}

export async function loadChartData(url: string) {
    try {
        // If this is a demo URL, generate random data
        if (url.startsWith('SPREADSHEET_URL')) {
            const dates = getDatesInCurrentMonth();
            const demoData = dates
                .filter(d => parseInt(d.date.split('/')[1]) <= 20)  // Only keep first 20 days
                .filter(() => Math.random() < 0.7)  // Randomly keep only 40% of days
                .map(d => ({
                    date: d.date,
                    value: Math.floor(Math.random() * 4) // Random value between 0 and 2 hours per day
                }));
            return preprocessChartData(demoData);
        }

        // Otherwise load from actual URL
        const data = await d3.csv(url);
        return preprocessChartData(data);
    } catch (error) {
        throw new Error(`Failed to load chart data: ${error}`);
    }
}

function preprocessChartData(data: any[]) {
    // Get all dates in the current month
    const allDates = getDatesInCurrentMonth();
    
    let cumulativeValue = 0;
    let prevValue = 0;
    // Process the data exactly as in niblings.js
    const processedData = allDates.map(dateObj => {
        const matchingEntries = data.filter(d => d.date === dateObj.date);
        const dayValue = matchingEntries.length > 0 
            ? matchingEntries.reduce((sum, entry) => sum + (parseFloat(entry.value) || 0), 0)
            : 0;
        
        cumulativeValue += dayValue;
        const valueChanged = cumulativeValue !== prevValue;
        prevValue = cumulativeValue;
        
        return {
            date: dateObj.date,
            value: cumulativeValue,
            showPoint: valueChanged
        };
    });

    return processedData;
}
