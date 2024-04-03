<script>
    // ========= CORE =========== //
    import { onMount } from 'svelte';
    import { connected, signerAddress } from 'svelte-wagmi';

    // ============ COMPONENTS =========== //
    import FarmBox from '$lib/components/FarmBox.svelte';
    import SortFarms from '$lib/components/SortFarms.svelte';

    // ========= CONFIG ============= //
    import { farms } from '$lib/config';
    import * as format from '$helpers/format';
    import * as priceHelper from '$helpers/prices';
    import { FARM_TOKEN_ADDRESS, DEAD_ADDRESS } from '$lib/config';

    // ========= CONTRACTS =========== //
    import * as erc20 from '$contracts/erc20';
    import * as masterChef from '$contracts/masterChef';

    // =========== UTILS ============== //
    import { parseEther, formatEther } from 'viem';
    import * as toast from '$stores/toasts';

    // ========= VARIABLES ========== //
    let totalTVL = 0;
    let farmTokenWPLS;
    let totalSupply;
    let farmTokenUSD;
    let WPLS_USD;
    let marketCap;
    let marketCapUSD;
    let pendingTotal;
    let burnedTotal;
    let circulating;

    // ========= EVENTS ============ //
    const addToTVL = (event) => {
    totalTVL += event.detail.amount;
    
    // Update the DOM with the new totalTVL value
    updateTotalTVL();
}

const updateTotalTVL = () => {
    const totalTVLElement = document.getElementById('totalTVL');
    if (totalTVLElement) {
        totalTVLElement.textContent = format.usd(totalTVL);
    }
}

// Store addToTVL function and totalTVL value in localStorage
localStorage.setItem('addToTVLFunction', addToTVL.toString());
localStorage.setItem('totalTVL', totalTVL);

    const refreshData = async() => {
        try {
            farmTokenWPLS = await priceHelper.farmTokenPrice();
            WPLS_USD = await priceHelper.toUsd(parseEther('1'));
            totalSupply = await erc20.totalSupply(FARM_TOKEN_ADDRESS);
            marketCap = formatEther(totalSupply) * formatEther(farmTokenWPLS);
            marketCapUSD = marketCap * WPLS_USD;
            farmTokenUSD = formatEther(farmTokenWPLS) * WPLS_USD;
            burnedTotal = await erc20.balanceOf(FARM_TOKEN_ADDRESS, DEAD_ADDRESS);            
            circulating = await erc20.getCirculatingSupply(FARM_TOKEN_ADDRESS);

        } catch (error) {
            console.log('Error fetching price data');
        }

        if ($connected) {
            let poolLength = await masterChef.poolLength();
            let totalRewards = BigInt(0);
            for(let i=0;i<poolLength;i++) {
                let rewards = await masterChef.pendingRewards(i, $signerAddress);
                totalRewards += rewards;
            }
            pendingTotal = totalRewards;
        }
    }

    onMount(async() => {
        setTimeout(function() {
            refreshData();
        }, 25);

        setInterval(function () {
            refreshData();
        }, 7000);
    });
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

 
<div class="text-white my-8 text-center grid grid-cols-1 md:grid-cols-4 gap-2 ">
    <!-- Box 1 -->
    

    <!-- Box 4 -->
    <div class="col-span-4 border-transparent border-4 relative">
        <img src="TVL.png" alt="Background Image" class="w-full h-full object-cover rounded-md">
        <div class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center flex-col bg-opacity-80 bg-transparent-900 p-4 rounded">
            <div>
                {#if totalTVL}
                    {format.usd(totalTVL)}
                {:else}
                    <div class="animate-spin">%</div>
                {/if}
            </div>
        </div>
    </div>
</div>

<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
    {#each farms as farm}
        
            <FarmBox info={farm} on:addToTVL={addToTVL} />
    {/each}
</div>



    
    
        
    
    
