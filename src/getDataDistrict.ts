import inquirer from "inquirer";

import { districts } from "./data.json";

export async function getDateDistrict(): Promise<{
    district: number;
}> {
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
