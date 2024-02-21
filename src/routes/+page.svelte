<script lang="ts">
	import { SignIn, SignOut } from '@auth/sveltekit/components';
	import { page } from '$app/stores';
</script>

<section class="flex flex-col items-center gap-8 justify-center h-screen">
	<h1 class="text-2xl">Welcome to Paprika</h1>

	<a href="/dinner">
		<button class="btn-primary">To Dinner</button>
	</a>
	<p>
		{#if $page.data.session}
			{#if $page.data.session.user?.image}
				<img src={$page.data.session.user.image} />
			{/if}
			<span class="signedInText">
				<small>Signed in as</small><br />
				<strong>{$page.data.session.user?.name ?? 'User'}</strong>
			</span>
			<SignOut />
		{:else}
			<span class="notSignedInText">You are not signed in</span>
			<SignIn provider="google" />
		{/if}
	</p>
</section>
