<script lang="ts">
    import Button from "@/components/atoms/button.svelte";
    import "@/styles/navbar.css";

    let isLoggedIn = $state(false);

    $effect(() => {
        const checkSession = () => {
            isLoggedIn = Boolean(localStorage.getItem("session"));
        };

        checkSession();

        window.addEventListener("sessionChanged", checkSession);

        return () => window.removeEventListener("sessionChanged", checkSession);
    });

    function handleLogout() {
        localStorage.removeItem("session");
        isLoggedIn = false;
        alert("Sesion cerrada");

        window.dispatchEvent(new Event("sessionChanged"));
    }
</script>

<nav class="navbar">
    <a class="logo" href="/">
        <div>Anti-Infernum</div>
    </a>

    <div class="navLinks">
        <div class="link">Incendios</div>
        <div class="link">Lugares Seguros</div>
        <div class="link">Alertas</div>

        {#if !isLoggedIn}
            <a href="/login">
                <div class="link">LOGIN</div>
            </a>
            <a href="/register">
                <div class="loginBtn">Registrate</div>
            </a>
        {:else}
            <Button class="loginBtn" onclick={handleLogout}
                >Cerrar Sesion</Button
            >
        {/if}
    </div>
</nav>
