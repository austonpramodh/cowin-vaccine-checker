import open from "open";
import dayjs from "dayjs";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import data from "./data.json";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getCenters } from "./getCenters";
import { getDateDistrict } from "./getDataDistrict";
// Variables

const ageLimit = 18;

async function main(): Promise<void> {
    try {
        const date = dayjs().format("DD-MM-YYYY");
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const answers = await getDateDistrict();
        const response = await getCenters(`${answers.district}`, date);
        // const response = data;

        const centers = response.centers;

        // filter all centers with age limit
        const centersWithAgeLimit = centers.filter(
            (center) => center.sessions.filter((session) => session.min_age_limit <= ageLimit).length > 0,
        );

        let vaccinesFound = false;

        // check for availability
        for (let i = 0; i < centersWithAgeLimit.length; i++) {
            const center = centersWithAgeLimit[i];
            const { sessions } = center;

            for (let j = 0; j < sessions.length; j++) {
                const session = sessions[j];

                if (session.available_capacity > 0) {
                    // print session available
                    console.log("--------------------------------------");
                    console.log(`Vaccine Available at ${center.address}`);
                    console.log(`Vaccines Available: ${session.available_capacity}`);
                    console.log(`Time Slots: ${session.slots.join(",")}`);
                    console.log(`Vaccine Type: ${session.vaccine}`);
                    console.log("--------------------------------------");
                    vaccinesFound = true;
                }
            }
        }

        if (vaccinesFound) {
            //open a music video on browser
            const yturl = "https://www.youtube.com/watch?v=H7HmzwI67ec&ab_channel=OwlCityVEVO";

            open(yturl);
        } else {
            //repeat the searching in 10 mins
            console.log("Vaccines not found, searching again in 10mins.");
            setTimeout(main, 1000 * 60 * 10);
        }
    } catch (error) {
        console.log("Failed with error::", error);
        // console.log("Failed with error::", error.data);
        setTimeout(main, 1000 * 60 * 10);
    }
}

main();
