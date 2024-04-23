<script lang="ts">
	export let entryText: string;
</script>

<input
	class="border-[1px] border-gray-200 rounded-lg px-8 bg-green/20 input"
	type="text"
	placeholder="Legg til"
	bind:value={entryText}
	on:change
	on:focusout
/>
