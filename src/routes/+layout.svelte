<script>
	import './layout.css';
	let { children } = $props();
</script>

<!-- Forçamos h-screen e flex-col no nível mais alto possível -->
<div class="h-screen w-screen flex flex-col overflow-hidden bg-red-500/10"> 
	{@render children()}
</div>

<style>
	/* CSS de emergência para garantir que o SvelteKit não limite a altura */
	:global(html, body, #svelte) {
		height: 100vh;
		width: 100vw;
		margin: 0;
		padding: 0;
		overflow: hidden;
	}
</style>