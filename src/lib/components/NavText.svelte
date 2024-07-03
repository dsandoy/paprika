<script lang="ts">
	export let url = '';
	export let isOpen: boolean;
</script>

<a
	href={url}
	on:click={() => (isOpen = false)}
	class="text-xl hover:text-primary font-semibold w-[100%] flex flex-row"><slot /></a
>
