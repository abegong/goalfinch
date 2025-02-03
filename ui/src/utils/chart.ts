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
            const demoData = dates.map(d => ({
                date: d.date,
                value: Math.floor(Math.random() * 3) // Random value between 0 and 2 hours per day
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
    
    // Process the data exactly as in niblings.js
    const processedData = allDates.map(dateObj => {
        const matchingEntries = data.filter(d => d.date === dateObj.date);
        const value = matchingEntries.length > 0 
            ? matchingEntries.reduce((sum, entry) => sum + (parseFloat(entry.value) || 0), 0)
            : 0;
        return {
            date: dateObj.date,
            value: value
        };
    });

    return processedData;
}
