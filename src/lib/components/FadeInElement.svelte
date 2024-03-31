<script lang="ts">
	/** Wrap this component to make it fade in. Make sure it has a container with a set size, and wrap this around its content. */
	import { onMount } from 'svelte';

	let isVisible = false;
	let element: HTMLElement;

	function handleIntersection(entries: IntersectionObserverEntry[]) {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				isVisible = true;
			} else {
				isVisible = false;
			}
		});
	}

	let observer;

	onMount(() => {
		observer = new IntersectionObserver(handleIntersection, {
			root: null, // Use the viewport as the root
			rootMargin: '0px',
			threshold: 0.4
		});

		observer.observe(element);
	});
</script>

<div class="animate-fadeIn" bind:this={element} class:visible={isVisible}>
	{#if isVisible}
		<slot />
	{/if}
</div>

<style>
	.animate-fadeIn {
		opacity: 0;
		transform: translateY(10px);
		transition:
			opacity 0.5s ease-in-out,
			transform 0.5s ease-in-out;
	}

	.animate-fadeIn.visible {
		opacity: 1;
		transform: translateY(0);
	}
</style>
