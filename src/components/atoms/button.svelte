<!-- @component Boton reutilizable que acepta contenido interno, un manejador de click y clases CSS opcionales. -->

<script lang="ts">
    import type { Snippet } from "svelte";
    import type { SvelteHTMLElements } from "svelte/elements";
    /**
     * Props para el boton.
     */
    type Props = SvelteHTMLElements["button"] & {
        /**
         * Clases CSS para el boton.
         */
        class?: string;
        /**
         * Contenido interno del boton.
         */
        children: Snippet;
    };
    let { class: className, children, ...rest }: Props = $props();
</script>

<button class={`${className?.trim() || ""}`} {...rest}>
    {@render children()}
</button>
