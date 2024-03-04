<script lang="ts">
	import { SignIn, SignOut } from '@auth/sveltekit/components';
	import { page } from '$app/stores';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
</script>

<section class="flex flex-col items-center gap-8 justify-center h-screen">
	<h1 class="text-2xl">Welcome to Paprika</h1>

	<a href="/dishes">
		<PrimaryButton>To Dinner</PrimaryButton>
	</a>
	{#if $page.data.session}
		<div
			class="flex items-center justify-center flex-col border-l-[8px] border-green p-5 pr-16 rounded bg-gray-100 w-96"
		>
			<div class="flex flex-row gap-3">
				{#if $page.data.session.user?.image}
					<img class="rounded-lg h-16" src={$page.data.session.user.image} alt="profile" />
				{/if}
				<div class="signedInText mb-5">
					<small>Signed in as</small><br />
					<strong>{$page.data.session.user?.name ?? 'User'}</strong>
				</div>
			</div>
			<SecondaryButton>
				<SignOut>Sign Out</SignOut>
			</SecondaryButton>
		</div>
	{:else}
		<div
			class="flex items-center justify-center flex-col border-l-[8px] border-red p-5 pr-16 rounded bg-gray-100 w-96 gap-4"
		>
			<div>You are not signed in</div>
			<SecondaryButton classNames="flex flex-row w-64 h-14 justify-center items-center gap-3">
				<img src="google-logo.png" alt="Google logo" class="h-6" />
				<SignIn provider="google" />
			</SecondaryButton>
		</div>
	{/if}
</section>
