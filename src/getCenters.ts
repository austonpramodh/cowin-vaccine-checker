import axios from "axios";

export interface CentersAvailabilityResponse {
    centers: {
        center_id: number;
        name: string;
        address: string;
        state_name: string;
        district_name: string;
        block_name: string;
        pincode: number;
        lat: number;
        long: number;
        from: string; //"09:00:00";
        to: string; //"16:00:00";
        fee_type: "Free" | "Paid";
        sessions: {
            session_id: string;
            date: string; //"11-05-2021";
            available_capacity: number;
            min_age_limit: number;
            vaccine: "COVISHIELD" | "COVAXIN";
            slots: string[]; //"09:00AM-11:00AM"
            available_capacity_dose1: number;
            available_capacity_dose2: number;
        }[];
    }[];
}

export async function getCenters(districtId: string, date: string): Promise<CentersAvailabilityResponse> {
    const url = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${date}`;

    const res = await axios.get<CentersAvailabilityResponse>(url, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36 Edg/90.0.818.56",
        },
    });

    return res.data;
}
