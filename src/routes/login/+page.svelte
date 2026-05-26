<script lang="ts">
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    import { page } from "$app/state";

    let loading = $state(false);

    function handleEnhance() {
        loading = true;

        return async ({ result }: { result: any }) => {
            if (result?.type === "success" && result.data) {
                localStorage.setItem("session", JSON.stringify(result.data));
                goto("/");
                window.dispatchEvent(new Event("sessionChanged"));
            }
            loading = false;
        };
    }
</script>

<div class="addUser">
    <h3>Login</h3>

    <form
        class="addUserForm"
        method="POST"
        action="?/login"
        use:enhance={handleEnhance}
    >
        <div class="inputGroup">
            <label for="email">Email:</label>
            <input
                id="email"
                name="email"
                type="email"
                placeholder="Ingresa tu email"
            />

            <label for="password">Contrasena:</label>
            <input
                id="password"
                name="password"
                type="password"
                placeholder="Ingresa tu contrasena super segura 👌"
            />

            {#if page.form?.error}
                <p class="error">{page.form.error}</p>
            {/if}

            <button type="submit" class="loginBtn" disabled={loading}>
                {loading ? "Ingresando..." : "Ingresar"}
            </button>
        </div>
    </form>

    <div class="login">
        <p>No tienes una cuenta?</p>
        <a href="/register">
            <button class="loginBtn">Registrate</button>
        </a>
    </div>
</div>

<style>
    .addUser {
        width: 100%;
        max-width: 450px;
        margin: 120px auto 50px;
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(10px);
        padding: 3rem;
        border-radius: 12px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.8);
    }

    .addUserForm .inputGroup {
        width: 100%;
        display: flex;
        flex-direction: column;
    }

    .addUserForm .inputGroup label {
        margin-top: 15px;
        color: var(--text-light);
        font-weight: 600;
        text-transform: uppercase;
        font-size: 0.85rem;
        letter-spacing: 0.5px;
    }

    .addUserForm .inputGroup input {
        margin-top: 8px;
        padding: 12px;
        background-color: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 6px;
        color: var(--text-light);
        font-size: 0.95rem;
        transition:
            border 0.3s ease,
            background 0.3s ease;
    }

    .addUserForm .inputGroup input:focus {
        outline: none;
        border: 1px solid var(--primary-red);
        background-color: rgba(255, 255, 255, 0.08);
    }

    .addUserForm .inputGroup input::placeholder {
        color: rgba(255, 255, 255, 0.4);
    }

    .inputGroup button {
        margin-top: 15px;
    }

    .error {
        color: var(--primary-red);
        font-size: 0.9rem;
        margin-top: 10px;
        text-align: center;
    }

    .login {
        margin-top: 30px;
        text-align: center;
    }

    .login p {
        color: var(--text-light);
        margin-bottom: 15px;
        font-size: 0.95rem;
    }

    .loginBtn {
        background: linear-gradient(var(--primary-red), #b71c1c);
        color: white;
        padding: 0.75rem 1.5rem;
        border: none;
        border-radius: 6px;
        font-weight: 600;
        text-transform: uppercase;
        cursor: pointer;
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease;
        font-size: 0.9rem;
        letter-spacing: 0.5px;
    }

    .loginBtn:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(211, 47, 47, 0.4);
    }

    .loginBtn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
        transform: none;
    }

    .addUser h3 {
        text-align: center;
        font-weight: 800;
        color: white;
        text-transform: uppercase;
        text-shadow: 1px 1px 8px rgba(0, 0, 0, 0.3);
        font-size: 1.8rem;
        margin-bottom: 1.5rem;
        letter-spacing: 1px;
    }
</style>
