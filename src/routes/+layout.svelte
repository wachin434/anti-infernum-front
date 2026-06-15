<script lang="ts">
    import Navbar from "@/components/organisms/navbar.svelte";
    import "@/styles/global.css";
    import icon from "$lib/assets/antiInfernumLogo.webp";

    let { children } = $props();
</script>

<svelte:head>
    <meta
        name="description"
        content="Plataforma inteligente para la prevención de desastres."
        
    />
    <link rel="icon" href={icon} />
</svelte:head>

<Navbar />
{@render children()}
