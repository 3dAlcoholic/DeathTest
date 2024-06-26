<script>
    // ============ CORE ============== //
    import { onMount, createEventDispatcher } from 'svelte';
    import { browser } from '$app/environment';
    import { formatEther, parseEther, isAddress } from 'viem';
    import { waitForTransaction, fetchBalance } from '@wagmi/core';

    // =========== COMPONENTS =========== //
    import Tooltip from './Tooltip.svelte';
    import { tooltip } from '$helpers/tooltip';

    // ============ STORES ============ //
    import { connected, signerAddress } from 'svelte-wagmi';
    import * as toast from '$stores/toasts';

    // ============= TRANSITIONS ====== //
    import { fade } from 'svelte/transition';
    import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

    // =========== CONFIG ============== //
    import { Types, Oracles, DepositTypes } from '$lib/config';
    import { MASTERCHEF_ADDRESS, FARM_TOKEN_ADDRESS, ZERO_ADDRESS } from '$lib/config';
    import { networkChainId } from '$lib/config';

    // ========= UTILS ========//
    import * as format from '$helpers/format';
    import * as priceHelper from '$helpers/prices';

    // ============= CONTRACTS ======== //
    import * as erc20 from '$contracts/erc20';
    import * as masterChef from '$contracts/masterChef';
    

    // ========== PROPS ============== //
    export let info;

    // ========== VARIABLES ========= //
    const dispatch = createEventDispatcher();

    let depositOpen = false;
    let withdrawOpen = false;
    let farmOpen = false;
    let balance;
    let nativeBalance;
    let apr;
    let staked;
    let stakedUSD;
    let stakedWPLS;
    let stakingTokenPrice;
    let tvl;
    let tvlUSD;
    let allowance;
    let rewards;
    let rewardsAsUSD;
    let depositAmount;
    let sentTVL = false;
    let withdrawAmount;
    let referee = ZERO_ADDRESS;
    let showDetails = false;
    let depositType = DepositTypes.TOKEN;
    let showApr = false;

    //check if a referral address is stored and set referee, otherwise set to the address(0)
    if (browser) {
        let ref = localStorage.getItem('referee');
        if (isAddress(ref)) {
            referee = ref;
        }
    }

    // =========== FUNCTIONS ========== //

    const openDepositModal = () => {
        depositOpen = true;
        document.body.scrollIntoView();
    }

    const openWithdrawModal = () => {
        withdrawOpen = true;
        document.body.scrollIntoView();
    }

    const setMaxDeposit = () => {
        if (balance > 0) {
            depositAmount = formatEther(balance);
        } else {
            depositAmount = 0;
        }
    }

    const setMaxWithdraw = () => {
        if (staked > 0) {
            withdrawAmount = formatEther(staked);
        } else {
            withdrawAmount = 0;
        }
    }

    const approve = async() => {
        try {
            if (depositAmount > 0) {
                //exact approval if they have an amount in the input box
                const amountToAllow = parseEther(depositAmount);
                const { hash } = await erc20.approve(info.stakingToken, MASTERCHEF_ADDRESS, amountToAllow);
                await waitForTransaction({hash})
            } else {
                //max approval if they don't have an amount in the input box
                const { hash } = await erc20.approve(info.stakingToken, MASTERCHEF_ADDRESS);
                await waitForTransaction({hash});
            }
            toast.success('Allowance Increased!')
            refreshData();
        } catch (error) {
            toast.error('Error Approving Spending.');
        }
    }

    const approveZapper = async() => {
        const { hash } = await erc20.approve(FARM_TOKEN_ADDRESS, ZAPPER_ADDRESS);
        await waitForTransaction({hash});
        toast.success('Approved Compound Zapper!')
    }

    const compound = async() => {
        try {
            const zapperAllowance = await erc20.allowance(FARM_TOKEN_ADDRESS, $signerAddress, ZAPPER_ADDRESS);
            if (zapperAllowance == 0) {
                await approveZapper();
            }
            const { hash } = await zapper.lpCompound(info.poolId, referee);
            await waitForTransaction({hash});
            toast.success('Compounded!')
        } catch (error) {
            toast.error('Error compounding');
            console.log(error);
        }
    }
 
    const deposit = async() => {
        if (depositType == DepositTypes.TOKEN) {
            depositToken();
        } else {
            depositPLS();
        }
    }

    const depositPLS = async() => {
        try {
            const depositInWei = parseEther(depositAmount);
            if (info.type == Types.Farm) {
                const { hash } = await zapper.zapper(depositInWei, info.poolId, referee);
                await waitForTransaction({hash});
                toast.success('Zapt In!');
            } else {
                const { hash } = await zapper.stakingZapper(depositInWei, info.poolId, referee);
                await waitForTransaction({hash});
                toast.success('Zapt In!');
            }
            depositOpen = false;
            refreshData();
        } catch (error) {
            console.log(error);
            toast.error('Error Zapping In');
        }
    }

    const depositToken = async() => {
        try {
            const depositInWei = parseEther(depositAmount);
            allowance = await erc20.allowance(info.stakingToken, $signerAddress, MASTERCHEF_ADDRESS);

            if (depositInWei > allowance) {
                toast.info('More allowance required');
                const { hash } = await erc20.approve(info.stakingToken, MASTERCHEF_ADDRESS, depositInWei);
                await waitForTransaction({hash});
                toast.success('Allowance increased!');
                depositToken();
            } else {
                const { hash } = await masterChef.deposit(info.poolId, depositInWei, ZERO_ADDRESS);
                await waitForTransaction({hash});
                toast.success(`Successfully Deposited!`);
                depositOpen = false;
            }
            
            refreshData();
        } catch (error) {
            console.log(error);
            toast.error('Deposit Failed.');
        }
    }

    const withdraw = async() => {
        try {
            const withdrawInWei = parseEther(withdrawAmount);
            const { hash } = await masterChef.withdraw(info.poolId, withdrawInWei, referee);
            await waitForTransaction({hash});
            toast.success('Successfully Withdrew!');
            withdrawOpen = false;
            refreshData();
        } catch (error) {
            console.log(error);
            toast.error('Withdraw Failed.');
        }
    }

    const harvest = async() => {
        try {
            const { hash } = await masterChef.claim(info.poolId, $signerAddress);
            await waitForTransaction({ hash });
            toast.success('Rewards Claimed!');
            refreshData();
        } catch (error) {
            console.log(error)
            toast.error('Error Harvesting.');
        }
    }

    const refreshData = async() => {
        //fetch pool info and calculate apr
        const farmTokenPrice = await priceHelper.farmTokenPrice();
        const WPLS_USD = await priceHelper.toUsd(parseEther('1'));

        //pool info
        const poolInfo = await masterChef.poolInfo(info.poolId);
        const allocPoints = poolInfo[1];
    
        const totalStaked = await erc20.balanceOf(info.stakingToken, MASTERCHEF_ADDRESS);
        const totalAllocPoints = await masterChef.totalAllocPoint();
        const rewardPerSec = await masterChef.rewardsPerSec();
        const poolRewards = (rewardPerSec * allocPoints) / totalAllocPoints;
        const poolRewardYear = poolRewards * BigInt(31536000); //Yearly rewards in BEET
        const yearRewardsInWavax = formatEther(poolRewardYear) * formatEther(farmTokenPrice);

        if(info.type == Types.Farm) {
            //if it's a farm we need to calculate the value of the TVL from the pair token
            tvl = await priceHelper.calculatePairValue(info.stakingToken, totalStaked, info.oracle);
            if (typeof tvl == 'bigint') {
                tvlUSD = formatEther(tvl) * WPLS_USD;
                if (allocPoints > 0) {
                    apr = (yearRewardsInWavax / formatEther(tvl)) * 100;
                } else {
                    apr = 0;
                }
            }
            
        } else {
            //calculate the tvl using just the single asset's price
            stakingTokenPrice = await priceHelper.tokenPrice(info.stakingToken, info.oracle);
            tvl = formatEther(stakingTokenPrice) * formatEther(totalStaked);
            tvlUSD = tvl * WPLS_USD;
            apr = (yearRewardsInWavax / tvl) * 100;
        }

        if (tvlUSD && !sentTVL) {
            dispatch('addToTVL', {
                amount: tvlUSD
            });
            sentTVL = true;
        }

        if ($connected) {
            //check users allowance
            allowance = await erc20.allowance(info.stakingToken, $signerAddress, MASTERCHEF_ADDRESS);

            //available balance
            balance = await erc20.balanceOf(info.stakingToken, $signerAddress);

            let userBalance = await fetchBalance({
                address: $signerAddress,
                chainId: networkChainId
            });

            if (userBalance?.value) {
                nativeBalance = userBalance.value;
            } else {
                nativeBalance = 0;
            }

            //staked balance
            let userInfo = await masterChef.userInfo(info.poolId, $signerAddress);
            staked = userInfo[0];

            //fetch pending rewards
            rewards = await masterChef.pendingRewards(info.poolId, $signerAddress);
            rewardsAsUSD = (formatEther(farmTokenPrice) * formatEther(rewards)) * WPLS_USD;
            

            if(info.type == Types.Farm) {
                //if it's a farm we need to calculate the value of the users staked balance from the pair token
                stakedWPLS = await priceHelper.calculatePairValue(info.stakingToken, staked, info.oracle);
                try {
                    stakedUSD = formatEther(stakedWPLS) * WPLS_USD;
                } catch (error) {
                    
                }
            } else {
                //calculate the users staked balance value using just the single asset's price
                stakingTokenPrice = await priceHelper.tokenPrice(info.stakingToken, info.oracle);
                stakedWPLS = formatEther(staked) * formatEther(stakingTokenPrice);
                stakedUSD = stakedWPLS * WPLS_USD;
            }
        } else {
            //not connected set
            balance = 0;
            rewards = 0;
            allowance = 0;
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


  
<div class=" border-2 border-[#ffcf40] w-full bg-[#000000a3] h-fit rounded-lg" style="box-shadow: 0 0 30px #00FFFF;">
    <div class="shadow-lg p-2 border-t-transparent border-t-4 border-l-4 border-l-transparent border-transparent-500  text-[#fff1bc] text-center rounded-lg">
    <div class="p-2">
        <div>
            <h2 class="text-3xl">{info.displayName}</h2>
        </div>
        <div class="mt-6 space-y-1 text-center">
            <div class="flex justify-center items-center">
                <h3>APR:</h3>
                <div>
                    {#if apr > 0}
                        <span>{format.apr(apr)}</span> <span class="cursor-pointer" on:click={()=>showApr = !showApr}>{#if showApr}-{:else}+{/if}</span>
                    {:else if apr == 0}
                        <span>0%</span>
                    {:else}
                        <div class="animate-spin">.</div>
                    {/if}
                </div>
            </div>
            {#if showApr}
                    <div class="p-2 mb-4" transition:slide={{ delay: 250, duration: 300, easing: quintOut, axis: 'y' }}>
                        <ul class="text-sm md:text-base lg:text-lg xl:text-xl text-center w-full">
                            <li>Daily: {format.apr(apr / 365)} {#if stakedUSD}<span class="text-green-200" style="font-size: 20px;">({format.usd(((apr / 365) / 100) * stakedUSD)})</span>{/if}</li>
                            <li>Weekly: {format.apr(apr / 52)} {#if stakedUSD}<span class="text-green-200" style="font-size: 20px;">({format.usd(((apr / 52) / 100) * stakedUSD)})</span>{/if}</li>
                            <li>Yearly: {format.apr(apr)} {#if stakedUSD}<span class="text-green-200" style="font-size: 20px;">({format.usd((apr / 100) * stakedUSD)})</span>{/if}</li>
                        </ul>
                    </div>
                {/if}
            <div class="flex justify-center items-center">
                <h3>TVL:</h3>
                <div>
                    {#if tvlUSD > 0}
                        <span>{format.usd(tvlUSD)}</span>
                    {:else}
                        <div class="animate-spin">.</div>
                    {/if}
                </div>
            </div>
        </div>
    </div>
    <div class="border-2 border-transparent bg-transparent-500 w-full mt-4 flex justify-center items-center">
        {#if farmOpen}
            <img src="Close.png" alt="Close" on:click={() => farmOpen = false} class="max-w-xs rounded-lg h-full cursor-pointer" />
        {:else}
            <img src="Open.png" alt="Open" on:click={() => farmOpen = true} class="max-w-xs rounded-lg h-full cursor-pointer" />
       
    
      
        {/if}
    </div>
    {#if farmOpen}
    <div transition:slide={{ delay: 250, duration: 300, easing: quintOut, axis: 'y' }} class="p-2 space-y-6 mt-4" style="transition: none;">
        <div class="space-y-2">
            <div>
                <img src="rewards1.png" alt="Rewards Image" class="h-15 w-auto">
            </div>
            <!-- Other content -->            
            <h5>
                {#if rewards => 0}
                    {format.wei(rewards)} <span class="text-xs">Abyss</span>
                    {#if rewardsAsUSD}
                    <div class="text-xs text-green-200 mt-1">
                        ({format.usd(rewardsAsUSD)})
                    </div>
                    {/if}
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="animate-spin w-6 h-6 mx-auto">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                {/if}
            </h5>
            <div class="border-2 border-transparent bg-transparent-500 w-full relative">
                <img src="Harvest.png" alt="Harvest Image" class="w-full h-full object-cover rounded-md">
                <button
                    on:click={harvest}
                    class="absolute inset-0 opacity-0 cursor-pointer p-4 rounded"
                >
                    Harvest
                </button>
            </div>
            
            {#if info.compound}
            <div class="border-2 border-black bg-yellow-500 w-full">
                <button
                    on:click={compound}
                    class="border-b-4 border-r-4 border-zinc-500 border-t-white border-t-4 border-l-4 border-l-white p-4 rounded text-xs hover:underline hover:bg-red-600 text-white w-full"
                >
                    Compound
                </button>
            </div>
            {/if}
        </div>
        <div class="space-y-2">
            <div>
                <img src="staked1.png" alt="staked Image" class="h-15 w-auto">
            </div>
            <h5 class="text-center">
                {#if staked => 0}
                    {format.wei(staked)} <span class="text-xs">{info.lpAbbreviation}</span>
                {:else}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="animate-spin w-6 h-6 mx-auto">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                    </svg>
                {/if}
            </h5>
            {#if stakedUSD} 
            <h6 class="text-xs text-green-200">({format.usd(stakedUSD)})</h6>
            {/if}
            <div class="flex space-x-1">
                <div class="border-2 border-transparent bg-transparent-500 w-full relative">
                    <img src="Deposit.png" alt="Deposit" class="w-full h-full object-cover rounded-md">
                    <button 
                        on:click={openDepositModal} 
                        class="absolute inset-0 opacity-0 cursor-pointer p-4 rounded">
                        Deposit
                    </button>
                </div>
                <div class="border-2 border-transparent bg-transparent-500 w-full relative">
                    <img src="withdraw.png" alt="Withdraw" class="w-full h-full object-cover rounded-md">
                    <button 
                        on:click={openWithdrawModal} 
                        class="absolute inset-0 opacity-0 cursor-pointer p-4 rounded"
                    >
                        Withdraw
                    </button>
                </div>
            </div>
            
            </div>
            <div>
                
                <div>
                    <ul class="text-s mt-4 text-left p-2 bg--500 rounded">
                        <li>Deposit Fee: {info.depositFee}%</li>
                        <li>Withdraw Fee: {info.withdrawFee}%</li>
                        <li>Staking Token: <a href="{info.liquidityLink}" class="underline">{info.displayName}</a></li>
                        <li>Pool Weight: {info.poolWeight}</li>
                    </ul>
                </div>
                
            </div>
        </div>
    
    {/if}
</div>
</div>

{#if depositOpen}
<div transition:fade={{ delay: 128, duration: 256 }} class="z-40 absolute top-0 left-0 insert-0 bg-black bg-opacity-50 overflow-y-auto h-screen w-full flex justify-center items-center" id="depositModal">
    <div class="relative opacity-inner w-4/5 md:w-1/4 text-white text-left border-4 border-black bg-gray-500">
        <div class="border-t-white border-t-4 border-l-4 border-l-white border-b-4 w-full border-r-4 border-zinc-400 p-6">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-interactive-supports-focus -->
            <div on:click={()=>depositOpen=false} class="absolute top-0 right-0 p-2 mr-2 cursor-pointer text-2xl" role="button">x</div>
            <div>
                <img src="Deposit.png" alt="deposit Image" class="h-15 w-auto">
            </div>
            
            <div class="flex flex-cols mb-8 mx-auto w-fit">
            {#if info.zaps}    
                {#if depositType == DepositTypes.TOKEN}
                <div class="border-2 border-black bg-blue-800">
                    <button 
                        on:click={()=>depositType = DepositTypes.TOKEN} 
                        class="border-t-orange-500 border-t-2 border-l-2 border-l-orange-500 border-b-2 w-full border-r-2 md:border-r-0 border-orange-900 p-2 text-xs hover:bg-blue-800 text-white"
                    >
                        TOKEN
                    </button>
                </div>
                <div class="border-2 border-black bg-blue-700">
                    <button 
                        on:click={()=>depositType = DepositTypes.PLS} 
                        class="border-t-orange-500 border-t-2 border-l-2 border-l-orange-500 border-b-2 w-full border-r-2 border-orange-900 p-2 text-xs hover:bg-blue-800 text-white"
                    >
                        PLS
                    </button>
                </div>
                {:else}
                <div class="border-2 border-black bg-blue-700">
                    <button 
                        on:click={()=>depositType = DepositTypes.TOKEN} 
                        class="border-t-orange-500 border-t-2 border-l-2 border-l-orange-500 border-b-2 w-full border-r-2 md:border-r-0 border-orange-900 p-2 text-xs hover:bg-blue-800 text-white"
                    >
                        TOKEN
                    </button>
                </div>
                <div class="border-2 border-black bg-blue-800">
                    <button 
                        on:click={()=>depositType = DepositTypes.PLS} 
                        class="border-t-orange-500 border-t-2 border-l-2 border-l-orange-500 border-b-2 w-full border-r-2 border-orange-900 p-2 text-xs hover:bg-blue-800 text-white"
                    >
                        PLS
                    </button>
                </div>
                {/if}
            {/if}
            </div>
            <div class="text-xs mb-1 flex justify-between">
                <div>
                    <button on:click={setMaxDeposit} class="hover:font-bold">[Max]</button>
                </div>
                <div>
                    {#if depositType == DepositTypes.PLS}
                        {format.wei(nativeBalance)} PLS
                    {:else}
                        {format.wei(balance)} {info.displayName}
                    {/if}
                </div>
            </div>
            <div class="space-y-1">
                <div class="border-2 border-[white]">
                    <input bind:value={depositAmount} type="text" class="bg-gray-500 w-full p-2 border-b-2 w-full border-r-2 border-transparent placeholder-white focus:outline-none text-white text-xs" />
                </div>
                {#if allowance > 0 || depositType==DepositTypes.PLS}
                <div class="border-2 border-gray bg-gray-500">
                    <button 
                         on:click={deposit}
                            class="border-b-4 border-r-4 border-gray-500 border-t-gray border-t-4 border-l-4 border-l-gray p-4 w-full"
                              style="background: url('Deposit.png') no-repeat center center; background-size: cover;" >
                              <!-- Optional text if needed -->
                          <span class="sr-only">Deposit</span>
                    </button>
                </div>
                {:else}
                <div class="border-2 border-white bg-gray-500">
                    <button 
                     on:click={approve} 
                     class="border-b-4 border-r-4 border-gray-500 border-t-gray border-t-4 border-l-4 border-l-gray p-4 w-full"
                          style="background: url('approve.png') no-repeat center center; background-size: cover;" >
                    <!-- Optional text if needed -->
                    <span class="sr-only">Approve Spending</span>
                   </button>

                </div>
                {/if}
            </div>
        </div>
    </div>
</div>
{/if}

{#if withdrawOpen}
<div transition:fade={{ delay: 128, duration: 256 }} class="z-40 absolute top-0 left-0 insert-0 bg-black bg-opacity-50 overflow-y-auto h-screen w-full flex justify-center items-center" id="withdrawModal">
    <div class="relative opacity-inner w-4/5 md:w-1/4 text-white text-left border-4 border-black bg-gray-500">
        <div class="border-t-white border-t-4 border-l-4 border-l-white border-b-4 w-full border-r-4 border-zinc-400 p-6">
            <!-- svelte-ignore a11y-click-events-have-key-events -->
            <!-- svelte-ignore a11y-interactive-supports-focus -->
            <div on:click={()=>withdrawOpen=false} class="absolute top-0 right-0 p-2 mr-2 cursor-pointer text-2xl" role="button">x</div>
            <div >
                <img src="withdraw.png" alt="Withdraw" class="h-15 w-auto">
            </div>
            
            <div class="text-xs mb-1 flex justify-between">
                <div>
                    <button 
                        on:click={setMaxWithdraw}  class="hover:font-bold" > [Max] </button>
                </div>
                <div>
                    {#if staked => 0}
                        {format.wei(staked)}
                    {:else}
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="animate-spin w-6 h-6 mx-auto">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                    {/if}
                </div>
            </div>
            <div class="space-y-1">
                <div class="border-2 border-[white]">
                    <input bind:value={withdrawAmount} type="text" class="bg-gray-500 w-full p-2 border-b-2 w-full border-r-2 border-transparent placeholder-white focus:outline-none text-white text-xs" />
                </div>
                <div class="border-2 border-gray bg-gray-500">
                    <button 
                         on:click={withdraw} 
                            class="border-b-4 border-r-4 border-gray-500 border-t-gray border-t-4 border-l-4 border-l-gray p-4 w-full"
                            style="background: url('withdraw.png') no-repeat center center; background-size: cover;" >
                          <!-- Optional text if needed -->
                         <span class="sr-only">Withdraw</span>
                     </button>

                </div>
            </div>
        </div>
    </div>
</div>
{/if}

<style>
    .opacity-inner {
        opacity: 100%;
    }

   
    
  
</style>