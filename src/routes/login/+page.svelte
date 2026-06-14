<script lang="ts">
    import { enhance } from "$app/forms";
    import { goto, invalidateAll } from "$app/navigation";
    import Button from "@/components/atoms/button.svelte";
    import "@/styles/register.css";
    import type { SubmitFunction } from "./$types";

    let loading = $state(false);
    let { form } = $props();
    function handleEnhance(): ReturnType<SubmitFunction> {
        loading = true;

        return async ({ result, update }) => {
            loading = false;

            if (result?.type === "success" && result.data) {
                localStorage.setItem("user-id", result.data.user.id);
                await invalidateAll();
                goto("/");
                return;
            }

            if (result?.type === "failure") {
                console.log(result);
                await update?.();
                return;
            }

            if (result?.type === "error") {
                console.error("Error crítico en el servidor.");
                await update?.();
            }
        };
    }
</script>

<svelte:head>
    <title>anti-infernum - Gestión de Incendios | Inicio de sesion</title>
</svelte:head>

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
                class={form?.errors?.email ? "error-indicator" : ""}
                id="email"
                name="email"
                type="email"
                placeholder="Ingresa tu email"
            />
            {#if form?.errors?.email}
                <p class="error">{form.errors.email}</p>
            {/if}

            <label for="password">Contrasena:</label>
            <input
                class={form?.errors?.contra ? "error-indicator" : ""}
                id="password"
                name="password"
                type="password"
                placeholder="Ingresa tu contrasena super segura 👌"
                autocomplete="current-password"
            />
            {#if form?.errors?.contra}
                <p class="error">{form.errors.contra}</p>
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
