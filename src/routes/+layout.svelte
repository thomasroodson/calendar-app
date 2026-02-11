<script lang="ts">
    import './layout.css';
	let { children } = $props();
</script>

<div class="min-h-screen bg-base-700 text-base-content">
    {@render children()}
</div>

<style>

</style>
