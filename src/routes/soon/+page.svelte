<script>
  // ========= CORE =========== //
  import { onMount } from 'svelte';
  import { connected, signerAddress } from 'svelte-wagmi';

  // ============ COMPONENTS =========== //
  import FaucetPage from '$lib/components/FaucetPage.svelte'; // import the FaucetPage

  onMount(async() => {
      setTimeout(function() {
          refreshData();
      }, 25);

      setInterval(function () {
          refreshData();
      }, 7000);
  });

  
</script>

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
      <!-- Home button -->
      <a 
            href="/" 
            class="block border-b-4 border-r-4 border-transparent border-t-transparent border-t-4 border-l-4 border-l-transparent p-4 text-s text-[#ffcf40]">
            Home >
        </a>
    </div>
</div>
<br>

  
    <!-- Box 1 -->
    

   

  <!-- FaucetPage component -->
  <div class="border-4 border-white bg-transparent-800 max-w-4xl mx-auto mb-6">
 <div class="block border-b-4 border-r-4 border-transparent border-t-transparent border-t-4 border-l-4 border-l-transparent p-4 text-s text-[#ffcf40]">
  <FaucetPage />
        </div>
    </div>