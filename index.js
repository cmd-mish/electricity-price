import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

// eslint-disable-next-line no-undef
const ENDPOINT = process.env.ENDPOINT;

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

            if (recordForCurrentHour) {
                const { timeStampHour, value, timeStampDay, unit } = recordForCurrentHour;

                const valueResponse = `${value} ${unit}`;
                return {
                    statusCode: 200,
                    body: JSON.stringify({
                        timeStampHour,
                        timeStampDay,
                        value: valueResponse
                    })
                };
            }
        }
        return { statusCode: 500, body: 'Something went wrong' };
    }
    catch (e) {
        console.error(e);
        return 500;
    }
};