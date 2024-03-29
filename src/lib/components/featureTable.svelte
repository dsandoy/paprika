<script lang="ts">
	import Icons from './Icons.svelte';

	const functionalities = [
		{
			description: 'Opprett dine egne matretter',
			checked: true
		},
		{
			description: 'Rediger og slett dine egne matretter',
			checked: true
		},
		{
			description: 'Handleliste',
			checked: false
		},
		{
			description: 'Opprett handleliste fra middagsplanlegger',
			checked: false
		},
		{
			description: 'Custom middagsplanlegger',
			checked: true
		},
		{
			description: 'Oversiktlig dashbord',
			checked: false
		}
	];
</script>

<table class="border-collapse rounded ml-20">
	<thead>
		<tr>
			<th class="border-b border-green/30 text-left p-2 px-4">Funksjonalitet</th>
			<th class="border-b border-green/30 p-2 px-4"></th>
		</tr>
	</thead>
	<tbody>
		{#each functionalities as functionality}
			<tr class="odd:bg-transparent even:bg-slate-50">
				<td class="border-b border-green/30 p-2 px-4">{functionality.description} </td>
				<td class="border-b border-green/30 p-2 px-4"
					>{#if functionality.checked}<Icons
							iconName="zondicons:checkmark-outline"
							classNames="text-green"
							height="1.7rem"
						></Icons>{:else}
						<Icons iconName="zondicons:time" classNames="text-nice-blue" height="1.7rem"
						></Icons>{/if}</td
				>
			</tr>
		{/each}
	</tbody>
</table>
