export function Login() {
    return (
        <div>
            <form
                action="/login"
                method="post"
                className="flex max-w-64 flex-col gap-2"
            >
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    autoComplete="username"
                    className="border-1 border-solid border-gray-200 p-1"
                />
                <input
                    type="password"
                    name="codeword"
                    placeholder="Codeword"
                    autoComplete="current-password"
                    className="border-1 border-solid border-gray-200 p-1"
                />
                <button type="submit" className="bg-blue-500 px-1 text-white">
                    Login
                </button>
            </form>
        </div>
    );
}
