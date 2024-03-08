<script lang="ts">
	export let url = '';
</script>

<a href={url} class="text-xl hover:text-green font-semibold w-[100%] flex flex-row"><slot /></a>
