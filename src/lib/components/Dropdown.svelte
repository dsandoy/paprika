<script lang="ts">
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let dropdownElement: HTMLElement;

	/** export value to let the parent know if the dropdown is open */
	export let isOpen = false;
	/** disables click outside*/
	export let disableClickOutside = false;
	/** Disable popup animation*/
	export let disableAnimation = false;

	/** apply styles to the button section here...*/
	export let classNamesButton = '';
	/** apply styles to the content section here...*/
	export let classNamesContent = '';

	onMount(() => {
		document.body.addEventListener('click', handleClickOutside);
	});

	function handleClickOutside(event: Event) {
		if (!dropdownElement) {
			return;
		}
		if (disableClickOutside) {
			return;
		}
		if (
			event.target instanceof Element &&
			!dropdownElement.contains(event.target) &&
			!event.defaultPrevented
		) {
			isOpen = false;
		}
	}

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	const transitionSettings = disableAnimation ? {} : { y: 100, duration: 200 };
</script>

<div bind:this={dropdownElement}>
	<section class={classNamesButton}>
		<button on:click={toggleDropdown} on:keydown={toggleDropdown}>
			<slot name="button">
				<button>Open</button>
			</slot>
		</button>
	</section>
	{#if isOpen}
		<section class={classNamesContent} transition:fly={transitionSettings}>
			<slot name="content">
				<span>Dropdown content</span>
			</slot>
		</section>
	{/if}
</div>
