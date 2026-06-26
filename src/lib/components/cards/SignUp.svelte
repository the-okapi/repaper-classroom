<script lang="ts">
	let { class: c, ...props } = $props();
</script>

<div class="{c} border" {...props}>
	<form method="POST" action="/signup"></form>
</div>
