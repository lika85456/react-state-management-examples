export default function Page() {
    return (
        <main className="max-w-screen-sm mx-auto mt-8">
            <h1 className="text-3xl font-bold">React State Management</h1>
            <p>
                This is a demo of different state management approaches in React. Checkout the article on <a className="underline" href="https://medium.com/@lika85456/react-state-management-2023-75c06d42f73b">Medium.com</a>
            </p>
            <h2 className="text-2xl font-bold mt-8">Apps</h2>
            <ul className="list-disc list-inside">
                <li>
                    <a className="underline" href="/jotai">Jotai</a>
                </li>
                <li>
                    <a className="underline" href="/redux">Redux</a>
                </li>
                <li>
                    <a className="underline" href="/react-query">React Query</a>
                </li>
            </ul>
        </main>
    );
}