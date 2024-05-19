<script lang="ts">
	export let data;
	const user = data.user;
</script>

<section
	class="flex justify-center items-center flex-col absolute top-16 bottom-0 left-0 right-0 p-4"
>
	<div class="prose">
		<h1>Profil</h1>
		<p>Forslag til hva som bør være her?</p>

		<div class="flex gap-4 p-4 items-center shadow bg-base-200 rounded">
			<div class="mask mask-circle">
				<img src={user.image} alt="Profile" />
			</div>
			<div>
				<strong>{user.name}</strong>
				<p class="text-sm">{user.email}</p>
			</div>
		</div>
		<p>Kanskje mange bilder?</p>
		<div class="flex w-full justify-between gap-8">
			<div class="mask mask-square">
				<img src={user.image} alt="Profile" />
			</div>
			<div class="mask mask-diamond">
				<img src={user.image} alt="Profile" />
			</div>
			<div class="mask mask-heart">
				<img src={user.image} alt="Profile" />
			</div>
			<div class="mask mask-star">
				<img src={user.image} alt="Profile" />
			</div>
			<div class="mask mask-squircle">
				<img src={user.image} alt="Profile" />
			</div>
		</div>
	</div>
</section>
