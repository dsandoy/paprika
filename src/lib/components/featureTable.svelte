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
			checked: true
		},
		{
			description: 'Opprett handleliste fra middagsplanlegger',
			checked: true
		},
		{
			description: 'Custom middagsplanlegger',
			checked: true
		},
		{
			description: 'Oversiktlig dashbord',
			checked: true
		},
		{
			description: 'Opprett dine egne matretter',
			checked: true
		},
		{
			description: 'Opprett dine egne matretter',
			checked: true
		},
		{
			description: 'Opprett dine egne matretter',
			checked: true
		},
		{
			description: 'Opprett dine egne matretter',
			checked: true
		},
		{
			description: 'Opprett dine egne matretter',
			checked: true
		},
		{}
	];
</script>

<table>
	<tr>
		<th> Funksjoner </th>
		<th>Gratis</th>
	</tr>
	{#each functionalities as functionality}
		<tr>
			<td>{functionality.description} </td>
			<td
				>{#if functionality.checked}<Icons iconName="radix-icons:checked"></Icons>{:else}
					<Icons iconName="radix"></Icons>{/if}</td
			>
		</tr>
	{/each}
</table>
