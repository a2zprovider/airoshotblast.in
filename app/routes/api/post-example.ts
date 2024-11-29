// app/routes/api/post-example.ts
import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const name = formData.get("name");

    if (!name) {
        return json({ error: "Name is required" }, { status: 400 });
    }

    return json({ message: `Hello, ${name}` });
};
