<script lang="ts">
	export let entryText: string;
</script>

<form>
	<input
		class="border-[1px] border-base-300 px-8 bg-primary/20 input"
		type="text"
		placeholder="Legg til"
		bind:value={entryText}
		on:change
		on:focusout
	/>
</form>
