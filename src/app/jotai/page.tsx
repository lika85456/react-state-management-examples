"use client";

import {
    atom, useAtomValue, useSetAtom, useAtom
} from "jotai";
import type { User } from "../react-query/page";
import React from "react";

async function fetchUsers(): Promise<{users: User[]}> {
    return fetch("/api/users", { method: "POST" }).then((res) => res.json());
}

async function updateUsers(users: User[]) {
    return fetch("/api/users", {
        method: "PUT",
        body: JSON.stringify({ users })
    }).then((res) => res.json());
}

const usersAtom = atom<{users?: User[], loading: boolean, error?: Error}>({
    users: undefined,
    loading: false,
});

export const useUsers = () => {
    const [users, setUsers] = useAtom(usersAtom);

    // load users
    React.useEffect(() => {
        if (users.users || users.loading)
        {
            return;
        }

        fetchUsers().then((res) => {
            setUsers({
                users: res.users,
                loading: false
            });
        }).catch((error) => {
            setUsers({
                users: [],
                loading: false,
                error
            });
        });
    }, [users, setUsers]);

    return users;
};

export const useUpdateUsers = () => {
    const setUsers = useSetAtom(usersAtom);

    return (users: User[]) => {
        setUsers({
            users,
            loading: true
        });
        updateUsers(users).then((res) => {
            setUsers({
                users: res.users,
                loading: false
            });
        }).catch((error) => {
            setUsers({
                users: [],
                loading: false,
                error
            });
        });
    };
};

export default function Page() {
    return (
        <div className="w-64 mx-auto mt-4 gap-2 flex flex-col">
            User list
            <hr />
            <UsersList />
            <hr />
            <AddUser />
            <RemoveAllUsers />
        </div>
    );
}

function UsersList() {

    const {
        users, loading, error
    } = useUsers();

    if (loading && !users) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!users || users.length === 0) {
        return <div>No users</div>;
    }

    return (
        <ul>
            {users!.map(user => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}

function AddUser() {

    const [name, setName] = React.useState("");
    const { users } = useAtomValue(usersAtom);
    const updateUsers = useUpdateUsers();

    const handleAddUser = () => {
        updateUsers([...users ?? [], {
            id: Math.random().toString(36).substr(2, 9),
            name
        }]);
    };

    return (
        <div className="flex flex-col gap-2">
            <input
                type="text"
                className="bg-slate-700"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <button onClick={handleAddUser}>Add user</button>
        </div>
    );
}

function RemoveAllUsers() {

    const updateUsers = useUpdateUsers();

    const handleRemoveAllUsers = () => {
        updateUsers([]);
    };

    return (
        <button onClick={handleRemoveAllUsers}>Remove all users</button>
    );
}