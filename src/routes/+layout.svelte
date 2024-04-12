<script>
    // core
    import { onMount } from 'svelte';
    import { defaultConfig } from 'svelte-wagmi';
    import { connection, connected, chainId, signerAddress, disconnectWagmi, WC } from 'svelte-wagmi';
    import { pulsechain } from '@wagmi/core/chains';

    // components
    import Toasts from '$components/Toasts.svelte';
    import * as toast from '$stores/toasts';

    // transitions
    import { fade } from 'svelte/transition';
    import { slide } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    // utilities
    import * as format from '$helpers/format';

    // assets
    
    import ERS_LOGO2 from "$lib/assets/astro.png";
    import BUY_LOGO from "$lib/assets/buy.png";
    import MINER_LOGO from "$lib/assets/miners.png";
    import CHART_LOGO from "$lib/assets/chart.png";
    import STAKING_LOGO from "$lib/assets/staking.png";
    import CONNECT_LOGO from "$lib/assets/connect.png";
    import DISCONNECT_LOGO from "$lib/assets/disconnect.png";

    import TELEGRAM_ICON from '$lib/assets/telegram_icon.png';
    import TWITTER_ICON from '$lib/assets/twitter-x_icon.png';
    import "../app.pcss";

    // config
    import { DAPP_TITLE, networkChainId } from '$lib/config';

    
    // functions
    const walletConnect = async () => {
        await WC('Sign in to the app');
    }

    const injectedConnector = async () => {
        await connection();
    }

    // variables
    let connectModalOpen = false;

    // store events
    connected.subscribe((connect) => {
        if (connect) {
            connectModalOpen = false;
            toast.success('Wallet Connected!');
        }
    })

    // functions
    onMount(async () => {
        const erckit = defaultConfig({
            autoConnect: true,
            appName: 'erc.kit',
            walletConnectProjectId: 'fda9e34bf32c195e3e908d0f312e40a7',
            chains: [pulsechain]
        });
        
        await erckit.init();
    });

    
    let isDropdownOpen = false;

function toggleDropdown() {
    isDropdownOpen = !isDropdownOpen;
}
</script>

<!-- Styles for mobile -->
<style>
    @media (max-width: 640px) {
        .connect-box {
            margin-left: 200px;
        }
    }

    
</style>

<!-- Svelte Head -->
<svelte:head>
    <title>{DAPP_TITLE}</title>
</svelte:head>

<!-- Toasts Component -->
<Toasts />



<!-- Main Content -->
<div class="mx-auto text-center w-full md:w-fit space-x-0 md:space-x-2 space-y-1 md:space-y-0 flex flex-col md:flex-row" style="box-shadow: 0 0 20px #00FFFF;">
        
    <div class="border-2 border-[#ffcf40] bg-[#000000a3] rounded-lg w-full md:w-44 h-20 flex items-center justify-center text-[#ffcf40] text-lg">
        <a href="https://pulsex.mypinata.cloud/ipfs/bafybeidea3ibq4lu5t6vk6ihp4iuznjb3ltsdm5y2shv4atxgyd3d33aim/#/?outputCurrency=0x898515c05794e195b4BA11c3e4e5A6d3c2a44FeC" class="block text-s text-white hover:underline">
            <img src="{BUY_LOGO}" alt="Button Logo" class="mx-auto h-20 w-auto mb-2" />                
        </a>
    </div>
    <div class="border-2 border-[#ffcf40] bg-[#000000a3] rounded-lg w-full md:w-44 h-20 flex items-center justify-center text-[#ffcf40] text-lg">
        <a href="/staking" class="block text-s text-white hover:underline">
            <img src="{STAKING_LOGO}" alt="staking Logo" class="mx-auto h-20 w-auto mb-2" />  
        </a>
    </div>
    <div class="border-2 border-[#ffcf40] bg-[#000000a3] rounded-lg w-full md:w-44 h-20 flex items-center justify-center text-[#ffcf40] text-xlg">
        {#if $connected}
            {format.address($signerAddress)}
        {:else}
            <!-- Placeholder box -->
        {/if}
    </div>
    
    <div class="border-2 border-[#ffcf40] bg-[#000000a3] rounded-lg w-full md:w-44 h-20 flex items-center justify-center text-[#ffcf40] text-lg">
        <a href="  " class="block text-s text-white hover:underline">
            <img src="{CHART_LOGO}" alt="Chart Logo" class="mx-auto h-20 w-auto mb-2" />  
        </a>
    </div>
    <!-- Box for User Address or Placeholder -->
    
    
    <!-- Connect/Disconnect Button -->
    <div class="border-2 border-[#ffcf40] bg-[#000000a3] rounded-lg w-full md:w-44 h-20 flex items-center justify-center text-[#ffcf40] text-lg">
        {#if !$connected}
            <button on:click={() => connectModalOpen = true} class="block text-s text-white hover:underline">
                <img src="{CONNECT_LOGO}" alt="Connect Logo" class="mx-auto h-20 w-auto mb-2 connect-box">
            </button>
        {:else}
            <button on:click={disconnectWagmi} class="block text-s text-white hover:underline">
                <img src="{DISCONNECT_LOGO}" alt="Connect Logo" class="mx-auto h-20 w-auto mb-2 connect-box">
            </button>
        {/if}
    </div>
</div>
<div class="mx-auto text-center w-full md:w-fit space-x-0 md:space-x-2 space-y-1 md:space-y-0 flex flex-col md:flex-row" style="box-shadow: 0 0 20px #00FFFF;">

<div class="border-2 border-[#ffcf40] bg-[#000000a3] rounded-lg w-full md:w-44 h-20 flex items-center justify-center text-[#ffcf40] text-lg">
    <a href="/miners" class="block text-s text-white hover:underline">
        <img src="{MINER_LOGO}" alt="Miners Logo" class="mx-auto h-20 w-auto mb-2" />  
    </a>
</div>
<div class="border-2 border-[#ffcf40] bg-[#000000a3] rounded-lg w-full md:w-44 h-20 flex items-center justify-center text-[#ffcf40] text-lg">
    <a href="/soon" class="block text-s text-white hover:underline">
        <img src="" alt="soon Logo" class="mx-auto h-20 w-auto mb-2" />  
    </a>
</div>
</div>

<div class="border-4 border-transparent bg-transparent max-w-6xl mx-auto mb-6">
    <div class="bg-transparent">
        
<!-- Remaining Content -->
<!-- Add your existing content here -->

        <div class="mt-8">
            {#if $chainId !== networkChainId && $connected}
                <div class="mx-auto p-2 bg-red-500 my-6 text-center max-w-2xl text-white border-4 border-red-900">
                    You're not connected to the right network, switch to PulseChain
                </div>
            {/if}
            <slot />
        </div>
    </div>
    </div>  

    {#if connectModalOpen}
<div transition:fade={{ delay: 128, duration: 256 }} class="z-40 absolute top-0 left-0 insert-0  bg-black bg-opacity-50 overflow-y-auto h-screen w-full flex justify-center items-center" id="withdrawModal">
    <div class="relative opacity-inner w-4/5 md:w-1/4 text-white text-left border-4 border-black bg-gray-500">
        <div class="border-t-white border-t-4 border-l-4 border-l-white border-b-4 w-full border-r-4 border-zinc-400 p-6">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-interactive-supports-focus -->
            <div on:click={()=>connectModalOpen=false} class="absolute top-0 right-0 p-2 mr-2 cursor-pointer text-2xl" role="button">x</div>
            <div class="text-center mt-4 mb-8">
                <img src="conwall.png" alt="Connect Wallet" class="mx-auto">
            </div>
            
            <div class="text-s mb-1 flex justify-between">

            </div>
            <div class="space-y-1">

            
                <div class="border-2 border-gray bg-gray-500">
                    <button 
                     on:click={walletConnect} 
                      class="border-b-4 border-r-4 border-zinc-500 border-t-gray border-t-4 border-l-4 border-l-gray p-4 rounded w-full"
                      style="background: url('wallet.png') no-repeat center center; background-size: cover; color: white;" >
                         <!-- Optional text if needed -->
                        
                       </button>
                </div>
                <div class="border-2 border-gray bg-gray-500">
                    <button 
                       on:click={injectedConnector} 
                        class="border-b-4 border-r-4 border-zinc-500 border-t-gray border-t-4 border-l-4 border-l-gray p-4 rounded w-full"
                          style="background: url('injected.png') no-repeat center center; background-size: cover; color: white;" >
                         <!-- Optional text if needed -->
                         
                     </button>
                </div>
            </div>
        </div>
    </div>
</div>
{/if}


        
 

<!-- Footer -->
<footer class="p-4 text-center mb-8 bg-transparent-800 text-white">
    <div class="mb-8 text-center">
        <img src="" class="mx-auto h-20 mb-2" alt="" />   
    </div>
    <div class="mx-auto flex items-center justify-center">
        <a href=" " target="_blank" class="mx-2">
            <img src={TWITTER_ICON} class="w-16 inline" alt="Follow on Twitter" />
        </a>
        <div class="mx-2">
            &copy; Copyright <strong class="text-[#ffcf40]">
                Death Staking
            </strong>
            <span class="mx-1">&bull;</span> <!-- Bullet separator -->
            All Rights Reserved
        </div>
        <a href=" " target="_blank" class="mx-2">
            <img src={TELEGRAM_ICON} class="w-16 inline" alt="Join Telegram" />
        </a>
    </div>
</footer>
