<script lang="ts">
    import Navbar from "@/components/organisms/navbar.svelte";
    import "@/styles/global.css";

    let { children } = $props();
</script>

<svelte:head>
    <title>anti-infernum - Gestión de Incendios</title>
    <meta
        name="description"
        content="Plataforma inteligente para la prevención de desastres."
    />
</svelte:head>

<Navbar />
{@render children()}
