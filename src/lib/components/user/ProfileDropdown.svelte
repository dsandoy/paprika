<script lang="ts">
	import Dropdown from '../Dropdown.svelte';
	import SecondaryButton from '../SecondaryButton.svelte';
	import { SignOut } from '$lib/Firebase';
	import { user } from '$lib/stores';
</script>

{#if $user}
	<Dropdown
		classNamesButton="flex items-center gap-3 cursor-pointer relative"
		classNamesContent="w-48 absolute bg-gray-100 border-[1px] border-green z-10 text-black p-5 right-5 top-14 rounded "
	>
		<span slot="button">
			{#if $user && $user.photoURL}
				<img class="rounded-lg h-10 lg:h-11" src={$user.photoURL} alt="profile" />
			{:else}
				<img class="rounded-lg h-10 lg:h-11" src="/google-logo.png" alt="profile" />
			{/if}
		</span>
		<div slot="content" class="flex flex-col gap-4">
			<p class="text-sm">{$user?.displayName || 'Ingen brukernavn'}</p>
			<SecondaryButton classNames="w-24 h-8 px-2 text-sm" on:click={SignOut}
				>Logg ut</SecondaryButton
			>
		</div>
	</Dropdown>
{:else}
	<SecondaryButton>
		<a href="/login">Logg inn</a>
	</SecondaryButton>
{/if}
