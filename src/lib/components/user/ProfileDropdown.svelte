<script lang="ts">
	import Icons from '../Icons.svelte';
	import { page } from '$app/stores';
	import { SignOut } from '@auth/sveltekit/components';
</script>

{#if $page.data.session}
	<div class="dropdown dropdown-left dropdown-bottom">
		<div tabindex="-1" class="mask mask-circle h-10 w-10 cursor-pointer">
			{#if $page.data.session.user?.image}
				<img src={$page.data.session.user.image} alt="profile" />
			{:else}
				<Icons iconName="zondicons:user" />
			{/if}
		</div>
		<div class="dropdown-content bg-base-100 rounded-box shadow z-[1] w-52 border-border-[1px]">
			<strong class="text-xs p-4 pl-6 pt-6">{$page.data.session.user?.name ?? 'User'}</strong>
			<ul class="menu" tabindex="-1">
				<li>
					<a class="justify-between" href="/profile"
						>Profil<Icons iconName="zondicons:user" height="0.75rem" /></a
					>
				</li>
				<li>
					<SignOut className=""
						><button
							class="flex flex-row justify-between items-center w-40 text-accent"
							slot="submitButton"
							>Logg ut <Icons iconName="zondicons:stand-by" height="0.75rem" /></button
						></SignOut
					>
				</li>
			</ul>
		</div>
	</div>
{:else}
	<a class="btn btn-primary btn-sm" href="/login"> Logg inn</a>
{/if}
