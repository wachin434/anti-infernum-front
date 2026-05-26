<script lang="ts">
    import Navbar from "@/components/organisms/navbar.svelte";
    import "@/styles/global.css";

    let { children } = $props();
</script>

<Navbar />
{@render children()}
