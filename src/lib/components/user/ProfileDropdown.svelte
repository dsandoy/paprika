<script lang="ts">
	import Dropdown from '../Dropdown.svelte';
	import SecondaryButton from '../SecondaryButton.svelte';
	import { user } from '$lib/stores';
	import Button from '../Button.svelte';
	import Icons from '../Icons.svelte';
	import { auth } from '$lib/Firebase';
	import { goto } from '$app/navigation';

	async function SignOut() {
		await auth.signOut();
		goto('/');
	}
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
				<span class="p-8">
					<Icons iconName="zondicons:user" classNames="h-10 lg:h-11" />
				</span>
			{/if}
		</span>
		<div slot="content" class="flex flex-col gap-4">
			<p class="text-sm">{$user?.displayName || 'TestUser'}</p>
			<SecondaryButton classNames="w-24 h-8 px-2 text-sm hover:bg-red" on:click={SignOut}
				>Logg ut</SecondaryButton
			>
		</div>
	</Dropdown>
{:else}
	<Button
		classNames="w-20 h-9 px-2 text-sm text-gray-900 bg-white rounded-lg hover:bg-nice-blue hover:text-white"
	>
		<a href="/login"> Logg inn</a>
	</Button>
{/if}
