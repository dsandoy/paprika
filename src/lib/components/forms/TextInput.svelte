<script lang="ts">
	import type { ValidationResult } from '$lib/utils';
	import ErrorAlert from './ErrorAlert.svelte';
	export let value: string;
	export let name: string;
	export let required = false;
	export let placeholder: string;
	export let validateFunction: () => ValidationResult;

	let v: ValidationResult = {
		is_valid: true,
		message: ''
	};
	function validate() {
		v = validateFunction();
	}
</script>

<label
	data-ui={!v.is_valid}
	class="input input-primary data-isOpen:focus-within:ring-error data-isOpen:text-error data-isOpen:border-error flex justify-center items-center gap-2 focus-within:outline-none focus-within:ring-2 focus-within:ring-primary"
>
	<slot name="before" />
	<input class="grow" type="text" {name} bind:value on:input={validate} {placeholder} {required} />
	<slot name="after" />
</label>
<ErrorAlert bind:v />
