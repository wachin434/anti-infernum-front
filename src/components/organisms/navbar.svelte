<script lang="ts">
    import Button from "@/components/atoms/button.svelte";
    import "@/styles/navbar.css";
    import icon from "$lib/assets/antiInfernumLogo.webp";
    import { page } from "$app/state";
</script>

<nav class="navbar">
    <div class="navLeft">
        <img class="icon" src={icon} alt="Logo" />
        <a class="logo" href="/">
            <div>Anti-Infernum</div>
        </a>
    </div>

    <div class="navLinks">
        <a href="/mapa">
            <div class="link">Mapa de Incendios</div>
        </a>
        <div class="link">Lugares Seguros</div>
        <div class="link">Alertas</div>

        {#if !page.data.isAuthenticated}
            <a href="/login">
                <div class="link">LOGIN</div>
            </a>
            <a href="/register">
                <div class="loginBtn">Registrate</div>
            </a>
        {:else}
            <form method="POST" action="/login?/logout">
                <Button class="loginBtn" type="submit">Cerrar Sesion</Button>
            </form>
        {/if}
    </div>
</nav>
