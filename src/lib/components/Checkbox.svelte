<script lang="ts">
	export let checked = false;
	export let disableCheckToggle = false;

	function toggleChecked() {
		if (disableCheckToggle) return;
		checked = !checked;
	}
</script>

<button on:click={toggleChecked}>
	<input type="checkbox" {checked} class="checkbox checkbox-primary" />
</button>
