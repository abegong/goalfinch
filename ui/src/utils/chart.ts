import * as d3 from 'd3';
import Papa from 'papaparse';

export function getDatesInMonth(asOfDate?: string) {
    const referenceDate = asOfDate ? new Date(asOfDate) : new Date();
    const year = referenceDate.getFullYear();
    const month = referenceDate.getMonth();
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

export async function loadChartData(url: string, asOfDate?: string) {
    try {
        // If this is a demo URL, generate random data
        if (url.startsWith('SPREADSHEET_URL')) {
            // For demo data, use the 20th of current month as the asOfDate
            const now = new Date();
            const demoAsOfDate = new Date(now.getFullYear(), now.getMonth(), 20).toLocaleDateString();
            
            const dates = getDatesInMonth(demoAsOfDate);
            const demoData = dates
                .filter(d => {
                    const day = parseInt(d.date.split('/')[1]);
                    return day <= 20;  // Only keep first 20 days
                })
                .filter(() => Math.random() < 0.7)  // Randomly keep only 70% of days
                .map(d => ({
                    date: d.date,
                    value: Math.floor(Math.random() * 8)
                }));
            return preprocessChartData(demoData, demoAsOfDate);
        }

        // Otherwise load from actual URL
        const response = await fetch(url);
        const csvText = await response.text();
        const { data } = Papa.parse(csvText, { header: true });
        return preprocessChartData(data, asOfDate);
    } catch (error) {
        throw new Error(`Failed to load chart data: ${error}`);
    }
}

function preprocessChartData(data: any[], asOfDate?: string) {
    // Get all dates in the month
    const allDates = getDatesInMonth(asOfDate);
    
    let cumulativeValue = 0;
    let prevValue = 0;
    
    // Process the data exactly as in niblings.js
    const processedData = allDates.map(dateObj => {
        // If we're past asOfDate, return the date with null value
        if (asOfDate && new Date(dateObj.date) > new Date(asOfDate)) {
            return {
                date: dateObj.date,
                value: null,
                showPoint: false
            };
        }

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
