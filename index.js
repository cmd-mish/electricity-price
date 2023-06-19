import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

// eslint-disable-next-line no-undef
const ENDPOINT = process.env.ENDPOINT;
const taxValue = 0.24;
const marginValue = 0.5;

const headers = { 'content-type': 'application/json' };

export const handler = async () => {
    try {
        const today = utcToZonedTime(new Date(), 'Europe/Helsinki');
        const currentDate = format(today, 'yyyy-MM-dd');
        const currentHour = format(today, 'HH');

        const URI = `${ENDPOINT}/${currentDate}/${currentDate}?lang=en`;
        const data = await fetch(URI);

        if (data.ok) {
            const json = await data.json();
            const recordForCurrentHour = json.find(item => item.timeStampHour === `${currentHour}:00`);

            const { value, unit } = recordForCurrentHour;

            const calculatedValue = (value * (1 + taxValue) + marginValue).toFixed(2);
            const valueResponse = `${calculatedValue} ${unit}`;
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    ...recordForCurrentHour,
                    currentHourValue: valueResponse,
                }),
            };

        }
        return { statusCode: 500, headers, body: 'Something went wrong' };
    }
    catch (e) {
        console.error(e);
        return 500;
    }
};
