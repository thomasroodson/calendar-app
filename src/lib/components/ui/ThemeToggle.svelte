<script lang="ts">
  import { onMount } from "svelte";
  import { MoonIcon, SunIcon } from "$lib/components/icons";

  let theme = $state("light");

  function updateTheme(newTheme: string) {
    theme = newTheme;
    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  }

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    updateTheme(nextTheme);
  }

  onMount(() => {
    const savedTheme = localStorage.getItem("theme");
    const systemPrefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");
    updateTheme(initialTheme);
  });
</script>

<button onclick={toggleTheme} class="btn btn-circle btn-ghost btn-sm" aria-label="Trocar tema">
  {#if theme === "light"}
    <MoonIcon size={20} color="currentColor" />
  {:else}
    <SunIcon size={20} color="currentColor" />
  {/if}
</button>
