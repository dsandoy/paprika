<script lang="ts">
	import { page } from '$app/stores';
	import Dropdown from '../Dropdown.svelte';
	import SecondaryButton from '../SecondaryButton.svelte';
</script>

<Dropdown
	classNamesButton="flex items-center gap-3 cursor-pointer relative"
	classNamesContent="w-48 absolute bg-gray-100 border-[1px] border-green z-10 text-black p-5 right-5 top-14 rounded "
>
	<span slot="button">
		{#if $page?.data?.session?.user?.image}
			<img class="rounded-lg h-10 lg:h-11" src={$page.data.session.user.image} alt="profile" />
		{:else}
			<img class="rounded-lg h-10 lg:h-11" src="/google-logo.png" alt="profile" />
		{/if}
	</span>
	<div slot="content" class="flex flex-col gap-4">
		<p class="text-sm">{$page.data?.session?.user?.name}</p>
		<SecondaryButton classNames="w-24 h-8 px-2 text-sm">Logg ut</SecondaryButton>
	</div>
</Dropdown>
