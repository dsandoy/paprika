<script lang="ts">
	import { page } from '$app/stores';
</script>

<main class="absolute top-0 bottom-0 left-0 right-0 flex flex-row justify-center items-center">
	<img src="/logo-green.svg" alt="Logo img" class="h-44 lg:h-52" />
	<div class="flex flex-col justify-center items-center gap-2">
		<h1 class="text-5xl">{$page.status}</h1>
		<p>{$page.error?.message}</p>
	</div>
</main>
