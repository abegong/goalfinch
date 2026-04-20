import Papa from 'papaparse';

interface RawChartRow {
  date: string;
  value: string | number;
}

export interface ProcessedChartDataPoint {
  date: string;
  value: number | null;
  showPoint: boolean;
}

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
            const demoSlides = dates
                .filter(d => {
                    const day = parseInt(d.date.split('/')[1]);
                    return day <= 20;  // Only keep first 20 days
                })
                .filter(() => Math.random() < 0.7)  // Randomly keep only 70% of days
                .map(d => ({
                    date: d.date,
                    value: Math.floor(Math.random() * 8)
                }));
            return preprocessChartData(demoSlides, demoAsOfDate);
        }

        // Otherwise load from actual URL
        const response = await fetch(url);
        const csvText = await response.text();
        const { data } = Papa.parse<RawChartRow>(csvText, { header: true });
        return preprocessChartData(data, asOfDate);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to load chart data: ${message}`);
    }
}

function preprocessChartData(
    data: RawChartRow[],
    asOfDate?: string,
): ProcessedChartDataPoint[] {
    const allDates = getDatesInMonth(asOfDate);

    let cumulativeValue = 0;
    let prevValue = 0;

    const processedData: ProcessedChartDataPoint[] = allDates.map(dateObj => {
        if (asOfDate && new Date(dateObj.date) > new Date(asOfDate)) {
            return {
                date: dateObj.date,
                value: null,
                showPoint: false
            };
        }

        const matchingEntries = data.filter(d => d.date === dateObj.date);
        const dayValue = matchingEntries.length > 0
            ? matchingEntries.reduce((sum, entry) => {
                const parsed = typeof entry.value === 'number'
                  ? entry.value
                  : parseFloat(entry.value);
                return sum + (Number.isFinite(parsed) ? parsed : 0);
              }, 0)
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
