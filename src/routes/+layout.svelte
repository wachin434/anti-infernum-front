<script lang="ts">
    import Navbar from "@/components/organisms/navbar.svelte";
    import "@/styles/global.css";

    let { children } = $props();
</script>

<svelte:head>
    <meta
        name="description"
        content="Plataforma inteligente para la prevención de desastres."
    />
</svelte:head>

<Navbar />
{@render children()}
