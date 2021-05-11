import open from "open";
import dayjs from "dayjs";
import chalk from "chalk";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import data from "./data.json";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { getCenters } from "./getCenters";
import { getDateDistrict } from "./getDataDistrict";
// Variables

const ageLimit = 18;
let count = 0;

async function checkForCentersLoop(district: string): Promise<void> {
    try {
        count++;
        console.log(`----------------Trial ${count}------------------`);
        const date = dayjs().format("DD-MM-YYYY");

        const response = await getCenters(district, date);
        // const response = data;

        const centers = response.centers;

        console.log(chalk.white(`Total Centers found for selected district: ${centers.length}`));

        // filter all centers with age limit
        const centersWithAgeLimit = centers.filter(
            (center) => center.sessions.filter((session) => session.min_age_limit == ageLimit).length > 0,
        );

        console.log(
            chalk.white(`Number of Centers with minimum age limit of ${ageLimit} years: ${centersWithAgeLimit.length}`),
        );

        let vaccinesFound = false;

        // check for availability
        for (let i = 0; i < centersWithAgeLimit.length; i++) {
            const center = centersWithAgeLimit[i];
            const { sessions } = center;

            let isHeaderPrinted = false;

            for (let j = 0; j < sessions.length; j++) {
                const session = sessions[j];

                if (session.available_capacity > 0) {
                    // print header
                    if (!isHeaderPrinted) {
                        isHeaderPrinted = true;
                        console.log(
                            chalk.greenBright(
                                `--- Name = ${center.name}, Block = ${center.block_name}; Pincode = ${center.pincode} ---`,
                            ),
                        );
                    }
                    // print session available
                    console.log(chalk.greenBright(`Date = ${session.date}; Capacity = ${session.available_capacity}`));
                    // console.log("--------------------------------------");
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
            console.log(
                chalk.red("Vaccine centers with vaccine availability not found, searching again in 30 seconds."),
            );
            setTimeout(() => checkForCentersLoop(district), 1000 * 30);
        }

        console.log(`----------------Trial ${count}------------------`);
    } catch (error) {
        console.log(chalk.red("Failed with error::"), error);
        // console.log("Failed with error::", error.data);
        console.log(chalk.red("Searching again in 30 seconds."));
        setTimeout(() => checkForCentersLoop(district), 1000 * 30);
    }
}

async function main(): Promise<void> {
    const answers = await getDateDistrict();

    checkForCentersLoop(`${answers.district}`);
    // checkForCentersLoop(`286`);
}

main();
