<!-- FaucetPage.svelte -->

<script>
    // ============ CORE ============== //
    import { onMount, createEventDispatcher } from 'svelte';
    import { browser } from '$app/environment';
    import { formatEther, parseEther, isAddress } from 'viem';
    import { waitForTransaction, fetchBalance } from '@wagmi/core';
  
    // ============ STORES ============ //
    import { connected, signerAddress } from 'svelte-wagmi';
    import * as toast from '$stores/toasts';

    // ============= TRANSITIONS ====== //
    import { fade } from 'svelte/transition';
    import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';

    import { networkChainId } from '$lib/config';
    // Define any JavaScript logic or data bindings here
    const dispatch = createEventDispatcher();

  </script>
  
  <style>
    /* Define any necessary CSS styles here */
  </style>
  
  
  
  
               
  
    
  
  <div class=" border-2 border-[#ffcf40] w-full bg-[#000000a3] h-fit rounded-lg" style="box-shadow: 0 0 30px #00FFFF;">
    <div class="shadow-lg p-2 border-t-transparent border-t-4 border-l-4 border-l-transparent border-transparent-500  text-[#fff1bc] text-center rounded-lg">
    <div class="p-2">
        <div>
            <h2 class="text-6xl">Banana Mayhem Stacker</h2>
        </div> </div> 
<br>
<br>
<br>

                    
       
                
        
            
            
                    
<div style="display: flex; justify-content: center;">
    <div style="display: flex; flex-direction: row; align-items: center;">
        <div className="row 1" style="margin-right: 200px;">
            <h5 className="mb-0 font-weight-semibold color-theme-1 mb-2 text-white mt-4">
                Available
            </h5>
            <p className="text-large mb-2 text-white">
                <span className="notranslate">...</span>
            </p>
            <p className="text-small">Pearl ≈ ... USDT</p>
        </div>

        <div style="display: flex; justify-content: center;">
            <div style="display: flex; flex-direction: row; align-items: center;">
                
        <div className="row 1" style="margin-right: 200px;">
            <h5 className="mb-0 font-weight-semibold color-theme-1 mb-2 text-white mt-4">
                Deposits
            </h5>
            <p className="text-large mb-2 text-white">
                <span className="notranslate">...</span>
            </p>
            <p className="text-small">Pearl ≈ ... USDT</p>
        </div>
        <div className="row 1">
            <h5 className="mb-0 font-weight-semibold color-theme-1 mb-2 text-white mt-4">
                Claimed
            </h5>
            <p className="text-large mb-2 text-white">
                <span className="notranslate">...</span>
            </p>
            <p className="text-small">Pearl ≈ ... USDT</p>
        </div>
    </div>
</div>
</div>   
</div>
<br>
<br>


       <div style="display: flex; justify-content: center;">
        <div style="display: flex; flex-direction: row; align-items: center;">
            <div className="row 2" style="margin-right: 210px;">
                <h5 className="mb-0 font-weight-semibold color-theme-1 mb-2 text-white mt-4">
                    Reward
                </h5>
                <p className="text-large mb-2 text-white">
                    <span className="notranslate">... / ...</span>
                </p>
                <p className="text-small">Direct / Indirect</p>
            </div>
    
            <div style="display: flex; justify-content: center;">
                <div style="display: flex; flex-direction: row; align-items: center;">
                    
            <div className="row 2" style="margin-right: 190px;">
                <h5 className="mb-0 font-weight-semibold color-theme-1 mb-2 text-white mt-4">
                    Max Payout
                </h5>
                <p className="text-large mb-2 text-white">
                    <span className="notranslate">...</span>
                </p>
                <p className="text-small">Pearl</p>
            </div>
            <div className="row 2">
                <h5 className="mb-0 font-weight-semibold color-theme-1 mb-2 text-white mt-4">
                    Team
                </h5>
                <p className="text-large mb-2 text-white">
                    <span className="notranslate">... / ...</span>
                </p>
                <p className="text-small">Players (Direct / Total)</p>
            </div>
        </div>
    </div>
</div>
</div>
       <br>
       <br>


       <div style="display: flex; justify-content: center;">
        <div style="display: flex; flex-direction: row; align-items: center;">
            <div className="row 3">
        <div style="width: 100%;"> <!-- Adjust width as needed -->
            <p >
                The Banana Mayhem Stacker is a low-risk, high reward contract that operates similarly to a high yield Degen Projects of the Past.
                 Players can participate by purchasing Bananas from PulseX or staking for some (degenerate), 
                 then by joining another user’s Bananas team (once meeting the Bananas deposit minimum requirement) depositing 
                 Bananas to the Stacker Contract earns a consistent 1% daily return of their Bananas (Until They Hit the Max Payout) passively.
            </p>
        </div>
    </div>
</div>
</div>
</div>
<br>
<br>
<div style="display: flex; justify-content: center;">
    <div style="display: flex; flex-direction: row; align-items: center;">
        <div className="row 4">
                        
                    </div>
                    <div className=" "><button id="copyRefButton" type="button" className="btn btn-link" style={{ display: 'none' }}>Copy Referral Link!</button>
                    </div>
                </div>
            </div>
        </div>
        <br>
        <br>

     
                        <div className="card mb-4 bg-info text-white">
                            <div className="card-body">
                              
                                <p className="card-text">
                                </p><div className="landing-page">
                                    <div className="text-left">
                                        <h3><span className="notranslate">Deposit</span></h3>
                                    </div>
                                    <form>
                                        <div className="form-group">
                                            <div className="row">
                                                <div className="col-6 text-left"><label className="text-white">Amount</label></div>
                                                <div className="col-6 text-right"> Bananas Balance:
                                                    <label className="user-balance text-white">N/A</label></div>
                                            </div>
                                            <div role="group" className="input-group">
                                                <input type="number" placeholder="Bananas" className="form-control" id="__BVID__213" />
                                            
                                            </div><small className="form-text text-left">A minimum of 1 Bananas required for deposits*</small><small className="form-text text-left">A 10% tax is charged on deposits                                                    *</small>
                                        </div>
                                        <div className="row justify-content-end">
                                            <div className="col-12 text-left"><button type="button" className="btn btn-outline-light">Deposit</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <p />
                            </div>
                        </div>
                        <p className="col-12 white mb-3">
                        </p><div>
                            <button type="button" className="btn btn-outline-light btn-block">HYDRATE(recompound)</button>
                            <button type="button" className="btn btn-outline-light btn-block">Claim</button>
                        </div>
                        <p />
                    
            
            








                <div className="row mb-4 mt-2">
                    <div className="container col-12 col-xl-6 col-lg-6 col-md-6 mb-4">
                        <h2>Get a Buddy</h2>
                        <div className="card bg-info text-white">
                            <div className="card-body">

                                <p className="card-text">
                                </p><form className>
                                    <div id="buddy-input">
                                        <fieldset className="form-group" id="__BVID__216">
                                            <h3><legend tabIndex={-1} className="bv-no-focus-ring col-form-label pt-0" id="__BVID__216__BV_label_">Buddy</legend></h3>
                                            <div><input type="text" placeholder="Address" className="form-control" id="__BVID__217" />
                                            </div>
                                        </fieldset>
                                        <div><button type="button" className="btn btn-outline-light">Update</button>
                                        </div>
                                        <div><br /><button type="button" className="btn btn-outline-light">Referral Link</button>
                                        </div>
                                    </div>
                                </form>
                                <p />
                            </div>
                        </div>
                    </div>
                    <div className="container col-12 col-xl-6 col-lg-6 col-md-6 mb-4">
                        <h2>Checkout Players</h2>
                        <div className="card bg-info text-white">
                            <div className="card-body">
                                <p className="card-text">
                                </p><h3>Bananas Player's Information</h3>
                                <div id="buddy-input">
                                    <div className="row">
                                        <label className="col-6">Direct Players </label><span id="player-directs" className="col-6 text-white">Direct Bananass</span>
                                        <label className="col-6">Indirect Players</label><span id="player-indirects" className="col-6 text-white">Indirect Bananass</span>
                                    </div>
                                </div>
                                <p />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row mb-4 mt-2">
                    <div className="container col-12">
                        <h2 className="text-white-50">About</h2>
                        <p className="text-white">Depositing Bananas to the FAUCET CONTRACT earns a consistent 1% daily return of their Bananas (365% maximum payout) passively. Players can also compound their earnings through regular deposits; rolling rewards as well as team based referrals .Faucet's contract cannot drain and will always be able to provide the Bananas that has been rewarded. Bananas rewards come from a 10% tax on all Bananas transactions excluding buys from the platform's SWAP page. 8% tax goes into the faucet pool that is used to pay daily ROIs and referral bonuses, while 1% tax is burnt and 1% is allocated for developer wallet to enhance the Bananas Network marketing and advertisement, and to make the Bananas token more valuable. If there is ever a situation where the tax pool is not enough to pay Bananas rewards new Bananas will be minted to ensure rewards are paid out. Given the game theory behind the Bananas network, the probability that the system will need to mint new Bananas to pay rewards is extremely low. Since Bananas deposited into faucet are sent to a burn address and drip is constantly being locked in the liquidity pool, drip is the only deflationary daily ROI platform. The best strategy for Bananas is to focus on real world adoption by building out your team through direct referrals, as you will receive bonus rewards from referrals on their deposits and profits as per investment plans. By doing so, you will dramatically accelerate your ROI period and allow your team’s chain to grow out organically. Not only are players able to passively increase their Bananas holdings in faucet through participation over time, but faucet also incentivizes players to participate actively by providing valuable referral rewards and building out their team.
                        </p>
                        <p id="referral" />
                    </div>
                </div>
            
        
        
            <div className="header">
                <div>
                    <svg data-v-ab5e3c86 xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto" className="waves">
                        <defs data-v-ab5e3c86>
                            <path data-v-ab5e3c86 id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
                        </defs>
                        <g data-v-ab5e3c86 className="parallax">
                            <use data-v-ab5e3c86 xlinkHref="#gentle-wave" x={48} y={0} fill="rgba(255,255,255,0.7" />
                            <use data-v-ab5e3c86 xlinkHref="#gentle-wave" x={48} y={3} fill="rgba(255,255,255,0.5)" />
                            <use data-v-ab5e3c86 xlinkHref="#gentle-wave" x={48} y={5} fill="rgba(255,255,255,0.3)" />
                            <use data-v-ab5e3c86 xlinkHref="#gentle-wave" x={48} y={7} fill="#fff" />
                        </g>
                    </svg>
                </div>
            </div> 