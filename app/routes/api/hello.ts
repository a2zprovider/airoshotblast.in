// app/routes/api/hello.ts
import { json } from "@remix-run/node";
import type { LoaderFunction } from "@remix-run/node";

export const loader: LoaderFunction = async () => {
  return json({ message: "Hello from the API!" });
};

