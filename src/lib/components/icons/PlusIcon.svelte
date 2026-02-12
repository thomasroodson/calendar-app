<script lang="ts">
  // Svelte 5: Usamos a desestruturação de props com o operador rest (...)
  let {
    size = 24,
    color = "#4285F4",
    ariaLabel = undefined,
    ...restProps // Isso captura 'class' e qualquer outro atributo extra
  } = $props();
</script>

<svg
  xmlns="http://www.w3.org/2000/svg"
  width={size}
  height={size}
  viewBox="0 0 24 24"
  fill="none"
  stroke={color}
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
  aria-label={ariaLabel}
  role="img"
  {...restProps}
>
  <line x1="12" y1="5" x2="12" y2="19" />
  <line x1="5" y1="12" x2="19" y2="12" />
</svg>
