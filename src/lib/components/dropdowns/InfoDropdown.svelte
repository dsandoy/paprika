<script lang="ts">
	import Icons from '../Icons.svelte';
</script>

<span class="dropdown lg:dropdown-hover dropdown-bottom dropdown-end">
	<span role="button" tabindex="0"
		><Icons
			iconName="zondicons:exclamation-outline"
			classNames="text-primary"
			height="1.0rem"
		/></span
	>
	<div
		tabindex="-1"
		class="dropdown-content z-[1] shadow bg-base-100 border-[1px] border-primary text-xs text-left p-2 rounded-sm w-52"
	>
		<slot />
	</div>
</span>
