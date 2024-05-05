<script lang="ts">
	import type { ValidationResult } from '$lib/utils';
	import Icons from '../Icons.svelte';

	export let v: ValidationResult;
</script>

{#if !v.is_valid}
	<div role="alert" class="text-xs alert p-1 pl-4 bg-red/20 rounded-sm">
		<Icons iconName="zondicons:close-outline" height="1.75rem" classNames="text-error" />
		{v.message}
	</div>
{/if}
