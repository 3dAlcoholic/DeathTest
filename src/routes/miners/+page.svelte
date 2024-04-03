<script>
    // ========= CORE =========== //
    import { onMount } from 'svelte';
    import { connected, signerAddress } from 'svelte-wagmi';

    // ============ COMPONENTS =========== //
    import PulsePage from '$lib/components/PulsePage.svelte'; // Import the Pulse page component

    // Your existing script content...
</script>

<!-- 2x2 on desktop and list on mobile -->
<style>
@media (max-width: 640px) {
    .grid-cols-1 {
        display: flex;
        flex-wrap: wrap;
    }
}
</style>

<div class="mx-auto text-center w-full md:w-fit space-x-0 md:space-x-2 space-y-1 md:space-y-0 flex flex-col md:flex-row" style="box-shadow: 0 0 20px #00FFFF;">
    <div class="border-2 border-[#ffcf40] bg-[#000000a3] rounded-lg w-full md:w-44 h-20 flex items-center justify-center text-[#ffcf40] text-lg">
        <a 
            href="/" 
            class="block border-b-4 border-r-4 border-transparent border-t-transparent border-t-4 border-l-4 border-l-transparent p-4 text-s text-[#ffcf40]">
            Home >
        </a>
    </div>
</div>
<br>

<PulsePage />