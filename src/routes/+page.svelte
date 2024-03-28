<script lang="ts">
	import { SignOut, auth } from '$lib/Firebase';
	import ColoredSection from '$lib/components/ColoredSection.svelte';
	import PrimaryButton from '$lib/components/PrimaryButton.svelte';
	import SecondaryButton from '$lib/components/SecondaryButton.svelte';
	import SideBar from '$lib/components/SideBar.svelte';
	import FeatureTable from '$lib/components/featureTable.svelte';
	import ProfileDropdown from '$lib/components/user/ProfileDropdown.svelte';
	// TODO GO for column based and not relative based style approach!
	// dark mode toggle in toolbar...

	const user = auth.currentUser;
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

<section class="flex flex-col items-center justify-center">
	<ColoredSection classNames="bg-transparent">
		<!-- <img
			class="h-36 lg:h-48 absolute right-[5rem] top-[5rem]"
			src="paprika_logos/white_g.png"
			alt="Logo img"
		/> -->
		<h1 class="text-5xl text-center absolute left-0 top[-10rem] right-0">
			Ta kontroll over middagene med Paprika!
		</h1>
		<a href="/dishes">
			<PrimaryButton>Til middager</PrimaryButton>
		</a>
		<div
			class="flex items-center justfy-center flex-col border-l-[8px] border-green p-3 lg:p-5 pr-16 rounded bg-gray-100 w-72 lg:w-96 mt-24"
		>
			<div class="flex flex-row gap-3">
				{#if user?.photoURL}
					<img class="rounded-lg h-12 lg:h-16" src={user.photoURL} alt="profile" />
				{/if}
				<div class="signedInText mb-5">
					<small>Logget inn som</small><br />
					<strong class="text-sm lg:text-base">{user?.displayName}</strong>
				</div>
			</div>
			<SecondaryButton on:click={SignOut} type="button" classNames="w-24 h-8 px-2 text-sm"
				>Logg ut</SecondaryButton
			>
		</div>
		<SecondaryButton
			type="button"
			on:click={() => (window.location.href = '/login')}
			classNames="flex flex-row w-48 lg:w-64 h-12 lg:h-14 justify-center items-center gap-3"
		>
			<img src="google-logo.png" alt="Google logo" class="h-6" />
			Logg Inn
		</SecondaryButton>
		<div
			class="flex items-center justify-center flex-col border-l-[8px] border-red p-3 mt-24 pr-16 rounded bg-gray-100 w-64 lg:w-96 gap-4"
		>
			<div class="text-sm lg:text-base">Du er ikke innlogget!</div>
		</div>
	</ColoredSection>
	<ColoredSection classNames="bg-gray-200 pl-8">
		<h3 class="text-base lg:text-2xl text-center w-full p-4">
			Med Paprika blir middagsplanlegging enkelt!
		</h3>
		<ol class="p-4 rounded border-[0px] border-red border-l-[6px]">
			<li>1. Se hva du har planlagt de neste dagene</li>
			<li>2. Trykk på rette du vil lage for å se oppskriften</li>
			<li>3. Lag i vei!</li>
		</ol>
		<!-- <img
			class="rounded absolute right-[30px] bottom-[25px] h-36 w-52 bg-gray-200"
			src="nonsense"
			alt="mypicture"
		/> -->
	</ColoredSection>
	<ColoredSection classNames="bg-transparent ">
		<h3>Lag Handlelista!</h3>
		<p>
			Paprika kan autmatisk lage handlelista for deg! Velg hvilke dager du vil handle for og voila!
		</p>
	</ColoredSection>
	<ColoredSection classNames="bg-green text-white">
		<h3>Legg til og oppdater matrettene dine!</h3>
		<p>
			Legg til matretter du liker, og hva som er ingrediensene du trenger å handle for å ta i bruk
			Paprikas utrolige funksjoner!
		</p>
		<FeatureTable></FeatureTable>
	</ColoredSection>
</section>
