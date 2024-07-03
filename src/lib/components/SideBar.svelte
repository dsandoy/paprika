<script lang="ts">
	import Button from './Button.svelte';
	import Dropdown from './Dropdown.svelte';
	import Icons from './Icons.svelte';
	import NavText from './NavText.svelte';

	let isOpen = false;
</script>

<Dropdown
	bind:isOpen
	classNamesButton="flex items-center gap-3 cursor-pointer relative "
	classNamesContent="w-42 lg:w-56 absolute bg-base-100 border-r-[1px] border-grey z-10 text-black p-5 left-0 top-16 bottom-0"
>
	<Button
		slot="button"
		data_ui={isOpen}
		classNames="data-isOpen:text-primary hover:text-primary px-0"
	>
		<Icons iconName="zondicons:menu" height="1.75rem" classNames="m-auto " />
	</Button>

	<section slot="content" class="flex flex-col gap-4">
		<NavText url="/dishes" bind:isOpen>
			<Icons iconName="zondicons:location-food" height="1.5rem" classNames="mr-5"
			></Icons>Matretter</NavText
		>
		<NavText url="/dashboard" bind:isOpen>
			<Icons iconName="zondicons:home" height="1.5rem" classNames="mr-5" />
			Dashbord</NavText
		>
		<NavText url="/dish-planner" bind:isOpen>
			<Icons iconName="zondicons:calendar" height="1.5rem" classNames="mr-5" />
			Planlegger</NavText
		>
		<NavText url="/shopping-list" bind:isOpen>
			<Icons iconName="zondicons:list" height="1.5rem" classNames="mr-5" />
			Handleliste
		</NavText>
	</section>
</Dropdown>
