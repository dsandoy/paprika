import { error, json } from "@sveltejs/kit";
import {prisma} from "$lib/prisma";

export async function GET(event) {
    const session = await event.locals.auth();
    if (!session?.user)
    {
        error(401, "unauthorized");
    }
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
