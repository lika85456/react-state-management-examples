import type { User } from "@/app/react-query/page";
import * as fs from "fs/promises";
const file = "/tmp/users.json";

async function save(users: User[]) {
    await fs.writeFile(file, JSON.stringify(users));
}

async function load() {
    try {
        const data = await fs.readFile(file);
        return JSON.parse(data.toString()) as User[];
    } catch (e) {
        return [];
    }
}

export async function POST() {
    return new Response(JSON.stringify({ users: await load() }), { headers: { "content-type": "application/json" }, });
}

export async function PUT(request: Request) {
    const { users } = await request.json();
    await save(users);
    return new Response(JSON.stringify({ users }), { headers: { "content-type": "application/json" }, });
}