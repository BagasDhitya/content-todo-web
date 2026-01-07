import { useEffect } from "react";

interface GoogleCredentialResponse {
    credential: string;
}

export default function Login() {
    useEffect(() => {
        /* global google */
        window.google.accounts.id.initialize({
            client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
            callback: handleGoogleLogin,
        });

        window.google.accounts.id.renderButton(
            document.getElementById("google-login-btn")!,
            {
                theme: "outline",
                size: "large",
                width: 280,
            }
        );
    }, []);

    async function handleGoogleLogin(
        response: GoogleCredentialResponse
    ) {
        try {
            const res = await fetch(
                `${import.meta.env.VITE_API_URL}/auth/google`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        idToken: response.credential,
                    }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message);
            }

            console.log("JWT from backend:", data.token);

            // 🔐 simpan token (sementara untuk testing)
            localStorage.setItem("token", data.token);

            alert("Login Google berhasil");
        } catch (error) {
            alert((error as Error).message);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
                <h1 className="text-2xl font-bold text-center mb-6">
                    Login
                </h1>

                <div className="flex justify-center">
                    <div id="google-login-btn" />
                </div>

                <p className="text-xs text-gray-500 text-center mt-6">
                    Login menggunakan akun Google untuk testing OAuth
                </p>
            </div>
        </div>
    );
}
