<script lang="ts">
	import Button from "./Button.svelte";
	import Dropdown from "./Dropdown.svelte";
	import Icons from "./Icons.svelte";
	import NavText from "./NavText.svelte";

    let isOpen = false;


</script>


<Dropdown bind:isOpen classNamesButton="flex items-center gap-3 cursor-pointer relative " classNamesContent="w-36 lg:w-56 absolute bg-gray-100 border-r-[1px] border-green z-10 text-black p-5 left-0 top-16 bottom-0">

    <Button slot="button" data_ui={isOpen} classNames="data-isOpen:text-gray-300 hover:text-gray-300 px-0">
        <Icons iconName="zondicons:menu" height="1.75rem" classNames="m-auto "></Icons>
    </Button>

    <section slot="content" class="flex flex-col gap-4">
        <NavText url="/dishes">Matretter</NavText>
        <NavText url="/dashboard">Dashbord</NavText>
        <NavText url="/dish-planner">Planlegger</NavText>

    </section>
</Dropdown>
