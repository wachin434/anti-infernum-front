<script lang="ts">
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    import Button from "@/components/atoms/button.svelte";
    import "@/styles/register.css";

    let loading = $state(false);
    let error = $state("");

    function handleEnhance() {
        error = "";
        loading = true;

        return async ({ result, update }: any) => {
            loading = false;

            if (result?.type === "success" && result.data) {
                try {
                    localStorage.setItem(
                        "session",
                        JSON.stringify(result.data),
                    );
                } catch (err) {
                    console.error("Error guardando sesión:", err);
                }

                goto("/");
                window.dispatchEvent(new Event("sessionChanged"));
                return;
            }

            if (result?.type === "failure") {
                error = result?.data?.error ?? "Credenciales inválidas.";
                await update?.();
                return;
            }

            if (result?.type === "error") {
                error = "Error de login. Intenta de nuevo.";
                await update?.();
            }
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

            {#if error}
                <p class="error">{error}</p>
            {/if}

            <Button type="submit" class="loginBtn" disabled={loading}>
                {loading ? "Ingresando..." : "Ingresar"}
            </Button>
        </div>
    </form>

    <div class="login">
        <p>No tienes una cuenta?</p>
        <a href="/register">
            <Button class="loginBtn">Registrate</Button>
        </a>
    </div>
</div>
