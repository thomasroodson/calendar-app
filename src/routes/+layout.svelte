<script>
  import "./layout.css";
  let { children } = $props();
</script>

<!-- Forçamos h-screen e flex-col no nível mais alto possível -->
<div class="flex h-screen w-screen flex-col bg-red-500/10 md:overflow-hidden">
  {@render children()}
</div>

<style>
  :global(html, body, #svelte) {
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    overflow: hidden;
  }
</style>
