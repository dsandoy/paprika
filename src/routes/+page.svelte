<script lang="ts">
	import { SignIn, SignOut } from '@auth/sveltekit/components';
	import { page } from '$app/stores';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
</script>

<section class="flex flex-col items-center gap-8 justify-center h-screen">
	<img class="h-36 lg:h-48" src="paprika_logos/white_g.png" alt="Logo img" />
	<h1 class="text-2xl">Velkommen til Paprika</h1>
	<p class="text-base lg:text-lg w-[66%] text-center">
		Ta kontroll over hva du skal ha til middag! Logg inn og sett i gang!
	</p>

	{#if $page.data.session}
		<a href="/dishes">
			<PrimaryButton>Til middager</PrimaryButton>
		</a>
		<div
			class="flex items-center justfy-center flex-col border-l-[8px] border-green p-3 lg:p-5 pr-16 rounded bg-gray-100 w-72 lg:w-96 mt-24"
		>
			<div class="flex flex-row gap-3">
				{#if $page.data.session.user?.image}
					<img class="rounded-lg h-12 lg:h-16" src={$page.data.session.user.image} alt="profile" />
				{/if}
				<div class="signedInText mb-5">
					<small>Logget inn som</small><br />
					<strong class="text-sm lg:text-base">{$page.data.session.user?.name ?? 'User'}</strong>
				</div>
			</div>
			<SignOut>
				<SecondaryButton type="button" classNames="w-24 h-8 px-2 text-sm">Logg ut</SecondaryButton>
			</SignOut>
		</div>
	{:else}
		<SignIn provider="google">
			<SecondaryButton
				slot="submitButton"
				type="button"
				classNames="flex flex-row w-48 lg:w-64 h-12 lg:h-14 justify-center items-center gap-3"
			>
				<img src="google-logo.png" alt="Google logo" class="h-6" />
				Logg Inn
			</SecondaryButton>
		</SignIn>
		<div
			class="flex items-center justify-center flex-col border-l-[8px] border-red p-3 mt-24 pr-16 rounded bg-gray-100 w-64 lg:w-96 gap-4"
		>
			<div class="text-sm lg:text-base">Du er ikke innlogget!</div>
		</div>
	{/if}
</section>
