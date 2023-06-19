import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

const ENDPOINT = process.env.ENDPOINT;

export const handler = async (event) => {
    try {
        const today = utcToZonedTime(new Date(), 'Europe/Helsinki');
        const currentDate = format(today, 'yyyy-MM-dd');
        const currentHour = format(today, 'HH');

        const URI = `${ENDPOINT}/${currentDate}/${currentDate}?lang=en`;
        const data = await fetch(URI);

        if (data.ok) {
            const json = await data.json();
            const output = json.find(item => item.timeStampHour === `${currentHour}:00`);
            return output;
        }
        return { statusCode: 500, body: 'Something went wrong' };
    }
    catch (e) {
        console.error(e);
        return 500;
    }
};