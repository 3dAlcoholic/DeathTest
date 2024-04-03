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
    }

    

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
<div class="mb-8 text-center" >
    <img src="banner1.png" class="mx-auto h-80 mb-2" alt="ORGN logo" />   
</div> 
<div class="text-white my-8 text-center grid grid-cols-1 md:grid-cols-4 gap-2 ">
    <!-- Box 1 -->
    <div class="col-span-2 border-transparent border-4 relative">
        <img src="price.png" alt="Background Image" class="w-full h-full object-cover rounded-md">
        <div class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center flex-col bg-opacity-80 bg-transparent-900 p-4 rounded">
            <div>
                {#if farmTokenUSD}
                    {format.price(farmTokenUSD)}
                {:else}
                    <div class="animate-spin">%</div>
                {/if}
            </div>
        </div>
    </div>

    <!-- Box 2 -->
    <div class="col-span-2 border-transparent border-4 relative ">
        <img src="market.png" alt="Background Image" class="w-full h-full object-cover rounded-md">
        <div class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center flex-col bg-opacity-80 bg-transparent-900 p-4 rounded">
            <div>
                {#if marketCapUSD}
                    {format.usd(marketCapUSD)}
                {:else}
                    <div class="animate-spin">%</div>
                {/if}
            </div>
        </div>
    </div>

    <!-- Box 3 -->
    <div class="col-span-2 border-transparent border-4 relative">
        <img src="supply.png" alt="Background Image" class="w-full h-full object-cover rounded-md">
        <div class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center flex-col bg-opacity-80 bg-transparent-900 p-4 rounded">
            <div>
                {#if totalSupply}
                    {format.wei(totalSupply)}
                {:else}
                    <div class="animate-spin">%</div>
                {/if}
            </div>
        </div>
    </div>

    <!-- Box 4 -->
    <div class="col-span-2 border-transparent border-4 relative">
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

    <div class="col-span-2 border-transparent border-4 relative ">
        <img src="circulating.png" alt="Background Image" class="w-full h-full object-cover rounded-md">
        <div class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center flex-col bg-opacity-80 bg-transparent-900 p-2 rounded">
            <div>
                {#if circulating}
                    {format.wei(circulating)}
                {:else}
                    <div class="animate-spin">%</div>
                {/if}
            </div>
        </div>
    </div>


    <!-- Box 5 -->
    <div class="col-span-2 border-transparent border-4 relative ">
        <img src="burned.png" alt="Background Image" class="w-full h-full object-cover rounded-md">
        <div class="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center flex-col bg-opacity-80 bg-transparent-900 p-2 rounded">
            <div>
                {#if burnedTotal}
                    {format.wei(burnedTotal)}
                {:else}
                    <div class="animate-spin">%</div>
                {/if}
            </div>
        </div>
    </div>
</div>




<div id="farmBoxesContainer" class="grid grid-cols-1 md:grid-cols-3 gap-4 hidden lg:hidden">
    {#each farms as farm}        
        <FarmBox info={farm} on:addToTVL={addToTVL} />        
    {/each}
</div>




    
    
        
    
    
