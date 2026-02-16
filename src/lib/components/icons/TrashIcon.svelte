<script lang="ts">
  export let size = 18;
  export let color: string = "currentColor";
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
  aria-hidden="true"
>
  <path d="M3 6h18" />
  <path d="M8 6V4h8v2" />
  <path d="M6 6l1 16h10l1-16" />
  <path d="M10 11v6" />
  <path d="M14 11v6" />
</svg>
