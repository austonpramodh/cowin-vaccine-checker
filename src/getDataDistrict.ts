import inquirer from "inquirer";

import { districts } from "./data.json";

interface Answers {
    district: number;
}

export async function getDateDistrict(): Promise<Answers> {
    const envDistrictId = process.env.DISTRICT_ID;

    if (envDistrictId) {
        for (const district of districts) {
            if (district.split(" ")[0] === envDistrictId) {
                return {
                    district: parseInt(envDistrictId),
                };
            }
        }
    }

    const answers = await inquirer.prompt([
        {
            type: "list",
            name: "district",
            message: "Please select your district",
            choices: districts.map((d) => ({
                name: d,
                value: d.split(" ")[0],
            })),
        },
    ]);

    return answers;
}
