<script lang="ts">
    import { enhance } from "$app/forms";
    import { goto } from "$app/navigation";
    import Button from "@/components/atoms/button.svelte";
    import "@/styles/register.css";
    import type { SubmitFunction } from "./$types";

    let loading = $state(false);
    let error = $state("");
    let { form } = $props();

    function handleEnhance(): ReturnType<SubmitFunction> {
        error = "";
        loading = true;

        return async ({ result, update }: any) => {
            loading = false;

            if (result?.type === "success") {
                alert(
                    "Usuario registrado exitosamente. Redirigiendo a login...",
                );
                await goto("/login");
                return;
            }

            if (result?.type === "failure") {
                console.log(result);
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

<svelte:head>
    <title>anti-infernum - Gestión de Incendios | Registro de sesion</title>
</svelte:head>

<div class="addUser">
    <h3>Registro</h3>

    <form
        class="addUserForm"
        method="POST"
        action="?/register"
        use:enhance={handleEnhance}
    >
        <div class="inputGroup">
            <label for="name">Nombre:</label>
            <input
                class={form?.errors?.nombre ? "error-indicator" : ""}
                name="name"
                type="name"
                placeholder="Ingresa tu nombre"
            />

            {#if form?.errors?.nombre}
                <p class="error">{form.errors.nombre}</p>
            {/if}

            <label for="email">Email:</label>
            <input
                class={form?.errors?.email ? "error-indicator" : ""}
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
                name="password"
                type="password"
                placeholder="Ingresa una contrasena super segura 👌"
            />

            {#if form?.errors?.contra}
                <p class="error">{form.errors.contra}</p>
            {/if}

            <label for="confirmPassword">Confirma la contrasena:</label>
            <input
                class={form?.errors?.confirmPassword ? "error-indicator" : ""}
                name="confirmPassword"
                type="password"
                placeholder="Confirma tu contrasena super segura 👌"
            />

            {#if form?.errors?.confirmPassword}
                <p class="error">{form.errors.confirmPassword}</p>
            {/if}

            <Button type="submit" class="loginBtn" disabled={loading}>
                {loading ? "Registrando..." : "Registrar"}
            </Button>
        </div>
    </form>

    <div class="login">
        <p>Ya tienes una cuenta?</p>
        <a href="/login">
            <Button class="loginBtn">Ingresa</Button>
        </a>
    </div>
</div>
