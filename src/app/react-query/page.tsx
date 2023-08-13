"use client";
import React from "react";
import {
    QueryClient, QueryClientProvider, useMutation, useQuery
} from "react-query";

const queryClient = new QueryClient();

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="w-64 mx-auto mt-4 gap-2 flex flex-col">
                User list
                <hr />
                <UsersList />
                <hr />
                <AddUser />
                <RemoveAllUsers />
            </div>
        </QueryClientProvider>
    );
}

export type User = {
    id: string;
    name: string;
};

function useUsers() {
    return useQuery<{users: User[]}, Error>(
        "users", // <-- query key, useful for mutations
        async() => {
            return fetch("/api/users", { method: "POST" }).then((res) => res.json());
        }
    );
}

function UsersList() {

    const {
        isLoading, error, data
    } = useUsers();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>An error has occurred: {error.message}</div>;

    if (!data || data.users.length === 0) {
        return <div>No users</div>;
    }

    return (
        <ul>
            {data?.users.map(user => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}

function updateUsers(users: User[]) {
    return fetch("/api/users", {
        method: "PUT",
        body: JSON.stringify({ users })
    }).then((res) => res.json());
}

function useUsersMutation() {
    return useMutation<{users: User[]}, Error, User[]>(updateUsers, {
        onSuccess: () => {
            queryClient.invalidateQueries("users");
        },
        // optimistic update
        onMutate: async(newUsers) => {
            await queryClient.cancelQueries("users");
            const previousUsers = queryClient.getQueryData<{users: User[]}>("users");
            queryClient.setQueryData<{users: User[]}>("users", () => {
                return { users: newUsers };
            });
            return { previousUsers };
        }
    });
}

function AddUser() {

    const {
        data: users, isLoading, isError
    } = useUsers();
    const [newUserName, setNewUserName] = React.useState("");
    const mutation = useUsersMutation();

    const handleAddUser = () => {
        mutation.mutate([...users!.users, {
            id: Math.random().toString(),
            name: newUserName
        }]);
    };

    return (
        <div className="flex flex-col gap-2">
            <input
                type="text"
                placeholder="New user name"
                className="bg-slate-700"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
            />
            <button onClick={handleAddUser} disabled={isLoading || isError}>
                Add user
            </button>
            {
                mutation.isLoading && <div>Adding user...</div>
            }
            {
                mutation.isError && <div>An error has occurred: {mutation.error?.message}</div>
            }
        </div>
    );
}

function RemoveAllUsers() {

    const mutation = useUsersMutation();

    const handleRemoveAllUsers = () => {
        mutation.mutate([]);
    };

    return (
        <div className="flex flex-col gap-2">
            <button onClick={handleRemoveAllUsers} disabled={mutation.isLoading || mutation.isError}>
                Remove all users
            </button>
            {
                mutation.isLoading && <div>Removing all users...</div>
            }
            {
                mutation.isError && <div>An error has occurred: {mutation.error?.message}</div>
            }
        </div>
    );
}