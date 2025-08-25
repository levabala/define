export function Login() {
    return (
        <div>
            <form
                action="/login"
                method="post"
                class="flex flex-col gap-2 max-w-64"
            >
                <input
                    type="text"
                    name="username"
                    placeholder="Username"
                    autocomplete="username"
                    class="border-solid border-1 border-gray-200 p-1"
                />
                <input
                    type="password"
                    name="codeword"
                    placeholder="Codeword"
                    autocomplete="current-password"
                    class="border-solid border-1 border-gray-200 p-1"
                />
                <button type="submit" class="px-1 bg-blue-500 text-white">
                    Login
                </button>
            </form>
        </div>
    );
}
