<script lang="ts">
	import { auth } from '$lib/Firebase';
	import ColoredSection from '$lib/components/ColoredSection.svelte';
	import DemoImage from '$lib/components/DemoImage.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import FeatureTable from '$lib/components/featureTable.svelte';
	import ProfileDropdown from '$lib/components/user/ProfileDropdown.svelte';
	import { user } from '$lib/stores';
	// TODO GO for column based and not relative based style approach!
	// dark mode toggle in toolbar...

	const usr = auth.currentUser;
	if (usr) {
		user.set(usr);
	}
</script>

<header class="w-svw h-16 flex bg-green justify-between px-5 items-center text-white">
	<SideBar />
	<a href="/dishes"
		><img class=" h-14 lg:w-16 lg:h-16" src="/paprika_logos/green.png" alt="Logo img" />
	</a>
	<div>
		<ProfileDropdown></ProfileDropdown>
	</div>
</header>

<div class="flex flex-col items-center justify-center gap-10">
	<section class="grid grid-cols-1 lg:grid-cols-2 w-screen pt-10 pl-4">
		<div class="">
			<h3 class="text-base lg:text-3xl w-full p-4 mb-5">
				Med Paprika blir middagsplanlegging enkelt!
			</h3>
			<ol class="p-4 rounded border-[0px] border-red border-l-[6px] text-xl ml-4">
				<li>1. Se hva du har planlagt de neste dagene</li>
				<li>2. Trykk på feltet du vil endre</li>
				<li>3. Velg middagen du vil lage!</li>
			</ol>
			<div class="flex justify-center">
				<SecondaryButton
					type="button"
					on:click={() => (window.location.href = '/login')}
					classNames="flex flex-row  h-10 lg:h-12 justify-center items-center gap-3 text-base"
				>
					<img src="google-logo.png" alt="Google logo" class="h-6" />
					Logg Inn
				</SecondaryButton>
			</div>
			<span class="container">
				<FeatureTable />
			</span>
		</div>
		<div class="bg-red rounded p-8 grid grid-cols-2">
			<div>
				<DemoImage
					classNames="w-[14rem] h-[21rem]"
					text="1. Se planen din"
					smallText="Planen viser denne og neste uke"
					img="peaks/plan1.png"
				/>
			</div>
			<div class="flex flex-col gap-5">
				<DemoImage
					classNames="h-[11rem]"
					text="2. Velg Dag"
					smallText="Velg dagen du vil endre på"
					img="peaks/plan2.png"
				/>

				<span class="mr-16">
					<DemoImage
						classNames="h-[14rem]"
						text="3. Velg middag"
						img="peaks/plan3.png"
						smallText="Søk eller bla etter ønsket middag"
					/>
				</span>
			</div>
		</div>
	</section>
</div>
