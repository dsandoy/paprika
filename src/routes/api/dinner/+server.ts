import { error, json } from "@sveltejs/kit";
import {prisma} from "$lib/prisma";

export async function GET(event) {
    // todo add auth
    const data = await prisma.dinner.findMany({
        include: {
            ingredients: true,
            image: true,
        }
    }).catch((err) => {
        error(500, "something went wrong when collecting data: " + err);
    });
    return json(data)

}
