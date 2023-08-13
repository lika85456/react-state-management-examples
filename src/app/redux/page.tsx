"use client";

import {
    createAsyncThunk, createSlice, configureStore
} from "@reduxjs/toolkit";
import type { User } from "../react-query/page";
import {
    useSelector, useDispatch, Provider
} from "react-redux";
import React from "react";

type UsersSliceState = {
    users: User[],
    loading: boolean,
    loaded: boolean,
    error: Error | undefined
};

const initialState: UsersSliceState = {
    users: [],
    loading: false,
    loaded: false,
    error: undefined
};

type State = ReturnType<typeof store.getState>;

export const fetchUsers = createAsyncThunk(
    "users/fetch",
    async() => {
        return fetch("/api/users", { method: "POST" }).then((res) => res.json());
    }
);

export const updateUsers = createAsyncThunk(
    "users/update",
    async(users: User[]) => {
        return fetch("/api/users", {
            method: "PUT",
            body: JSON.stringify({ users })
        }).then((res) => res.json());
    }
);

export const usersSlice = createSlice({
    name: "users",
    initialState,
    reducers: {}, // synchronous actions/reducers go here
    extraReducers: (builder) => {
        builder.addCase(fetchUsers.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.loaded = true;
            state.users = action.payload.users;
        });
        builder.addCase(fetchUsers.rejected, (state, action) => {
            state.loading = false;
            state.loaded = true;
            state.error = action.error as Error;
        });
        builder.addCase(updateUsers.pending, (state, action) => {
            state.loading = true;
            // optimimstic update
            state.users = action.meta.arg;
        });
        builder.addCase(updateUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload.users;
        });
        builder.addCase(updateUsers.rejected, (state, action) => {
            state.loading = false;
            // rollback
            state.error = action.error as Error;
        });
    }
});

const store = configureStore({ reducer: { users: usersSlice.reducer } });

type AppDispatch = typeof store.dispatch;

export default function Page() {

    return (
        <Provider store={store}>
            <div className="w-64 mx-auto mt-4 gap-2 flex flex-col">
                User list
                <hr />
                <UsersList />
                <hr />
                <AddUser />
                <RemoveAllUsers />
            </div>
        </Provider>
    );
}

function UsersList() {

    const users = useSelector((state: State) => state.users.users);
    const loaded = useSelector((state: State) => state.users.loaded);

    const dispatch = useDispatch<AppDispatch>();

    // load users on mount
    React.useEffect(() => {
        if (!loaded) {
            dispatch(fetchUsers());
        }
    }, [loaded, dispatch]);

    if (!users || users.length === 0) {
        return <div>No users</div>;
    }

    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}

function AddUser() {

    const [name, setName] = React.useState("");
    const users = useSelector((state: State) => state.users.users);
    const dispatch = useDispatch<AppDispatch>();

    const handleAddUser = () => {
        dispatch(updateUsers([...users, {
            id: Date.now().toString(),
            name
        }]));
    };

    return (
        <div className="flex flex-col gap-2">
            <input className="bg-slate-700" type="text" value={name} onChange={(e) => setName(e.target.value)} />
            <button onClick={handleAddUser}>Add user</button>
        </div>
    );
}

function RemoveAllUsers() {

    const dispatch = useDispatch<AppDispatch>();

    const handleRemoveAllUsers = () => {
        dispatch(updateUsers([]));
    };

    return (
        <button onClick={handleRemoveAllUsers}>Remove all users</button>
    );
}