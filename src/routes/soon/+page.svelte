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



 

    

<div class="flex justify-center items-center ">
    <div class="text-center mt-8 flex flex-cols space-x-1">
        <div class="border-2 border-[#00FFFF] bg-[#000000a3] rounded w-full md:w-64">
            <a 
                href="/" 
                class="block border-b-4 border-r-4 border-transparent border-t-transparent border-t-4 border-l-4 border-l-transparent p-4 text-s text-[#ffcf40]">
                Home >
            </a>
        </div>
    </div>
</div>
<br>
<br>







    
    
        
    
    
