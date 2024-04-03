<!-- PulsePage.svelte -->

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
    

  </script>
  
  <style>
    /* Define any necessary CSS styles here */
  </style>
  
  
  
  <!-- Hero Section -->    
   
  <div class="border-2 border-[#ffcf40] rounded-lg mx-auto" style="width: 100%; max-width: 600px; height: 1050px; box-shadow: 0 0 30px #00FFFF; padding: 20px;">
    <div class="shadow-lg p-2 border-t-transparent border-t-4 border-l-4 border-l-transparent border-transparent-500 text-[#fff1bc] text-center rounded-lg" style="height: 100%;">
        <div class="p-2">
              <div class=" d-flex align-items-center justify-content-center">
                <div class="d-flex flex-column pt-1">
                  <span style="letter-spacing: 5px; font-size: 1.95rem; margin-bottom: 10px; color: #10abca;" class="myfont-text center">  <!--"Myfont is from CSS Added Font"-->
                    WELCOME TO 
                  </span>                   
                  <h1 class="busd text-center texting"
                    style="-webkit-text-stroke: 1px #19ced4; color:black; letter-spacing: 2px; margin-left: 5px;font-size: 1.85rem;margin-bottom: 10px;">
                    Eternity Explorers
                </h1>
                  <h2 class="text-center" style="max-width: 328px;">
                    The PLS Miner with Abundant Daily Returns and Lowest Fees
                  </h2>
                </div>
              </div>
            </div>
            <div class="stats-row-container justify-center" >
              <div class="justify-center">
                <h3 class="text-center texting" style="margin-left: 5px;">
                  Statistics
                </h3>
                <hr>
                <div class="stat d-flex flex-column justify-content-center align-items-center">
                  <div class="header">
                      <i class="bi-bank" style="color: #ffffff; font-size: 16px; margin-left: 10px;"></i>&nbsp;
                      Total Referrals
                  </div>
                  <div class="data">
                      <strong class="number mb-md-2 busd"
                          style="-webkit-text-stroke: 1px #12859c; color: #12859c; letter-spacing: 2px; font-size: 20px;"
                          id="total-ref">-</strong>
                  </div>
              </div>
              
              <div class="stat d-flex flex-column justify-content-center align-items-center">
                  <div class="header">
                      <i class="bi-bank" style="color:#ffffff; font-size: 16px; margin-left: 10px;"></i>&nbsp;
                      Contract Balance
                  </div>
                  <div class="data">
                      <strong class="number mb-md-2 busd"
                          style="-webkit-text-stroke: 1px #12859c; color: #12859c; letter-spacing: 2px; font-size: 20px;"
                          id="contract-balance">-</strong>
                  </div>
              </div>
              
              <div class="stat d-flex flex-column justify-content-center align-items-center">
                  <div class="header">
                      <i class="bi-bank" style="color: #ffffff; font-size: 16px; margin-left: 10px;"></i>&nbsp;
                      Total Commanders
                  </div>
                  <div class="data">
                      <strong class="number mb-md-2 busd"
                          style="-webkit-text-stroke: 1px #12859c; color: #12859c; letter-spacing: 2px; font-size: 20px;"
                          id="total-players">-</strong>
                    </div>
                  </div>
                </div>
              </div>
              <div>
                <h3 class="text-center texting" style="margin-left: 5px;">              
                  Benefits
                </h3>
                <hr>
                <div class="stats mt-md-3 text-left">
                    <h4 class="mb-4 mb-sm-0">
                        <i class="bi bi-check-square-fill icon-custom" style="color: #0ad403;"></i>
                        <span id="daily-rate">
                            0% Daily ~ 0% APR
                        </span>
                    </h4>
                    <h4 class="mb-4 mb-sm-0">
                        <i class="bi bi-check-square-fill icon-custom" style="color: #0ad403;"></i>
                        <span id="daily-compound">
                            0% Redeploy Bonus
                        </span>
                    </h4>
                    <h4 class="mb-4 mb-sm-0">
                        <i class="bi bi-check-square-fill icon-custom" style="color: #0ad403;"></i>
                        <span id="ref-bonus">
                            0% Referrals
                        </span>
                    </h4>
                    <h4 class="mb-4 mb-sm-0">
                        <i class="bi bi-check-square-fill icon-custom" style="color: #0ad403;"></i>
                        <span id="ref-bonus">
                            <span id="compound-step">18</span> Hours Deployment Cooldown
                        </span>
                    </h4>
                    <h4 class="mb-4 mb-sm-0">
                        <i class="bi bi-check-square-fill icon-custom" style="color: #0ad403;"></i>
                        <span id="ref-bonus">
                            <span id="withdraw-cooldown">4</span> Hours Reward Collection Cooldown
                        </span>
                    </h4>
                    <h4 class="mb-4 mb-sm-0">
                        <i class="bi bi-check-square-fill icon-custom" style="color: #0ad403;"></i>
                        <span id="ref-bonus">
                            <span id="cut-off-step">36</span> Hours Rewards Accumulation Cut-Off
                        </span>
                    </h4>
                    <h4 class="mb-4 mb-sm-0">
                        <i class="bi bi-check-square-fill icon-custom" style="color: #0ad403;"></i>
                        <span id="ref-bonus">
                            <span id="no-tax-compound-count">10</span> Times Mandatory Deployment Feature
                        </span>
                    </h4>
                    <h4 class="mb-4 mb-sm-0">
                        <i class="bi bi-check-square-fill icon-custom" style="color: #0ad403;"></i>
                        <span id="ref-bonus">80% Feedback Tax For Early Reward Collectors</span>
                    </h4>
                    <h4 class="mb-4 mb-sm-0">
                        <i class="bi bi-check-square-fill icon-custom" style="color: #0ad403;"></i>
                        <span id="ref-bonus">Anti-Bot Launch</span>
                    </h4>
                </div>
                
                </div>
              </div>
            </div>
          
   
 <br>
  
    
 <div class="border-2 border-[#ffcf40] rounded-lg mx-auto" style="width: 100%; max-width: 600px; height: 1500px; box-shadow: 0 0 30px #00FFFF; padding: 20px;">
    <div class="shadow-lg p-2 border-t-transparent border-t-4 border-l-4 border-l-transparent border-transparent-500 text-[#fff1bc] text-center rounded-lg" style="height: 100%;">
        <div class="p-2">
                <p style="font-size: 25px;">This is the text content.</p>
                <hr>
        
           
          <div class="stat d-flex justify-between">
            <div class="header">
              <i class="bi-bank">
              </i>&nbsp;
              <span>
                Initial Deposit :
              </span>
            </div>
            <div class="d-flex items-center">
              <strong id="initial-deposit" class="number">
                0
              </strong>
              <div>
                <strong class="usdc">
                  &nbsp;PLS
                </strong>
              </div>
            </div>
          </div>
          <div class="stat d-flex justify-between">
            <div class="header">
              <i class="bi-bank"></i>&nbsp;
              <span>
                Total Deposit :
              </span>
            </div>
            <div class="d-flex items-center">
              <strong id="total-deposit" class="number">
                0
              </strong>
              <div>
                <strong class="usdc">
                  &nbsp;PLS
                </strong>
              </div>
            </div>
          </div>
          <div class="stat d-flex justify-between">
            <div class="header">
              <i class="bi-bank"></i>&nbsp;
              <span>
                Total Collected :
              </span>
            </div>
            <div class="d-flex items-center">
              <strong id="total-withdrawn" class="number">
                0 
              </strong>
              <div>
                <strong class="usdc">
                  &nbsp;PLS
                </strong>
              </div>
            </div>
          </div>
          <div class="stat d-flex justify-between">
            <div class="header">
              <i class="bi-bank"></i>&nbsp;
              <span>
                Referrals :
              </span>
              (<span id="ref-count">0</span>)
            </div>
            <div class="d-flex items-center">
              <strong id="ref-rewards-bnb" class="number">
                0
              </strong>
              <div>
                <strong class="usdc">
                  &nbsp;PLS
                </strong>
              </div>
            </div>
          </div>
          <hr>
          <div>
            <div>
              <h6 class="text-center">
                <i style="color: #12859c;" class="ri-alert-line"></i>
                <strong style="color: #12859c;">
                  Disclaimer&nbsp;:&nbsp;
                </strong> Funds that are used to initially Deploy Explorers (including Deploying More Explorers) cannot be withdrawn.
                However, your Explorers will continuously recruit more Explorers for you to Collect Rewards. Please use the
                application at your own risk.
              </h6>
              <hr />
            </div>
            <br>
          </div>
          <div class="w-100 justify-center">
            <div class="first-box">
              <div class="deposit-container">
                <div class="row example">
                  <div class="col-lg-8">
                    <div style="line-height: 1.4; font-size: 14px;">
                      <strong>
                        Reward Example
                      </strong>
                      <div>
                        <div>
                          1
                          <span class="busd">
                            PLS
                          </span>
                          =
                          <span id="example-miners">
                            0
                          </span>
                          Explorers
                        </div>
                        <!-- <div>
                          <i class="bi-minecart"></i>
                        </div> -->
                        <div>
                          <i class="ri-coins-line ri-1x"></i>
                          Daily Yield:
                          <span id="example-bnb">
                            0
                          </span>
                          <span class="busd">
                            PLS
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="col-lg-4">
                    <div class="wallet">
                      <i class="bi-wallet2"></i>
                      <strong>
                        Wallet
                      </strong>
                      <div>
                        <span id="user-balance">
                          0
                        </span>
                        <span class="busd">
                          PLS
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="timer" style="color:white;">
                  <i class="bi-hourglass-split"></i>
                  Countdown until Rewards are Cut Off
                </div>
                <div style="text-align: center;">
                  <span id="claim-timer">00:00:00</span>
                </div>
                <br>
                <div class="timer" style="color:white;">
                  <i class="bi bi-clock"></i>
                  Time until next Deployment Bonus is Activated
                </div>
                <div style="text-align: center;">
                  <span id="compound-timer"> --:--:--</span>
                </div>
                <br>
                <div class="btn-container">
                  <strong style="padding-left: 5px; padding-bottom: 5px" >
                    <span style="font-size: 16px;">                    
                    </span>
                    Deposit
                    <span class="busd">
                      PLS
                    </span>
                    <span class="usd">
                      ( Min <span class="busd" id="min-deposit">0 </span>,
                    </span>
                    <span class="usd">
                      Max
                      <span class="busd" id="max-deposit">0</span> )
                    </span>
                    <input class="form-control" id="bnb-spend" name="buy-miners" onChange="updateBuyPrice()" step="100"
                      type="number" value="1">
                  </strong>
                  <button class="start-btn3" style="width: 100%;margin-bottom: 10px; margin-top: 15px;" id="buy-eggs-btn"
                    onclick="hireFarmers()" role="button" disabled>
                    Deploy
                    <span id="eggs-to-buy">0</span>
                    Explorers
                  </button>
                </div>
              </div>
            </div>
            <hr />
            <div style="margin-top: 10px;">
              <div class="deposit-container">
                <div class="miners-info" style="margin-bottom: unset;">
                  <div>
                    <i class="bi-minecart"></i>
                    <span id="your-miners">0 </span>
                    Explorers
                  </div>
                  <div>
                    <i class="bi-arrow-down-short" style="font-size: 27px;"></i>
                  </div>
                  <div style="font-size: 25px;">
                    <i class="ri-coins-line ri-1x"></i>
                    <strong id="mined">0</strong>
                    <span><strong class="busd">PLS</strong></span>
                  </div>
                  <br>
                  <!-- <span class="usd" style="font-size: 14px;">
                    ≈ $<span id="mined-usd" >0 </span> USD
                  </span> -->
                  <div class="timer" style="color:white;">
                    Estimated daily yield:
                  </div>
                  <div style="text-align: center;">
                    <span id="eggs-per-day">0</span>
                    <strong class="busd">PLS</strong>
                  </div>
                </div>
                <div>
                  <br>
                  <div class="timer" style="color:white;">
                    <i class="bi-arrow-repeat"></i>
                    Deployment Count:
                  </div>
                  <div style="text-align: center;">
                    <span id="compound-count">0 Time/s</span>
                  </div>
                  <div class="btn-container">
                    <div style="padding-top: 6px;padding-bottom: 14px;">
                      <button class="btn start-btn"
                      style="width: 100%;background: transparent;border: 1px solid white;padding: 8px;margin-top: 5px;"
                      id="withdraw" onclick="sellCrops()" role="button" disabled>
                      Collect Rewards
                      <span class="cooldown" id="cooldown-timer">in 00:00:00</span>
                      <span class="tax" id="withdraw-tax">-80% tax</span>
                    </button>
                  </div>
                  
                    <button class="btn start-btn3" style="width: 100%;" id="reinvest" onclick="hireMoreFarmers()"
                      role="button" disabled>
                      Deploy More Explorers
                      <span class="compound">
                        (<span class="compound" id="compound-bonus">+0%</span>)
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <hr />
          </div>
          <div class="mt-1 text-center" style="padding: 10px; font-size: 15px; font-weight: 500;">
            Every time you Deploy without Collecting Rewards, your Deployment bonus grows by
            <span id="compound-percent">0%</span>
            (max <span id="max-compound">+0%</span>). Deploying 10 times will reset your bonus to 1.  Collecting Rewards will reset your bonus to 0.
            <br>
            <!--  Time until next compound bonus is activated: <span style="font-weight: 700;" id="compound-timer">00:00:00</span> -->
          </div>
          <hr />
          <div class="col-lg-12 referral-link">
            <span>
              <i class="bi-check2-square"></i>
              Earn
              <span id="ref-percent">0%</span>
              <span>when someone uses your referral link!</span>
              <span>
                <a id="reflink"></a>
                <span onclick="copyRef()">
                  <i class="ri-file-copy-line"></i>
                  <span id="copied"></span>
                </span>
              </span>
          </div>
        </div>
      </div>
      

      
