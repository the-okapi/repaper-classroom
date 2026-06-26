<script lang="ts">
	let { class: c, ...props } = $props();
</script>

<div class="{c} border border-(--o) bg-(--bg) p-6 rounded-xl" {...props}></div>
