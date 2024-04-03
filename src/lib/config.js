
export const DAPP_URL = " ";
export const DAPP_TITLE = "Death Staking";

export const networkChainId = 369;

export const MASTERCHEF_ADDRESS = "0xE27bF313710416ec341201D681259c36Cd88F70A";
export const NATIVE_TOKEN_ADDRESS = "0xA1077a294dDE1B09bB078844df40758a5D0f9a27"; //WPLS
export const FARM_TOKEN_ADDRESS = "0x160Aaea031006C125F8Be4A00f77AC5010BECB3c"; //Yield 
export const STABLECOIN_ADDRESS = "0xefD766cCb38EaF1dfd701853BFCe31359239F305"; //DAI
export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
export const DEAD_ADDRESS = "0x000000000000000000000000000000000000dEaD";

//PulseX V1
export let PULSEX_V1_FACTORY_ADDRESS = "0x1715a3E4A142d8b698131108995174F37aEBA10D";
export let PULSEX_V1_ROUTER_ADDRESS = "0x98bf93ebf5c380C0e6Ae8e192A7e2AE08edAcc02";

//PulseX V2
export let PULSEX_V2_FACTORY_ADDRESS = "0x29ea7545def87022badc76323f373ea1e707c523";
export let PULSEX_V2_ROUTER_ADDRESS = "0x165C3410fC91EF562C50559f7d2289fEbed552d9";

//DEXTOP


export const Oracles = {
    PULSEX_V1: 0,
    PULSEX_V2: 1,
    
}

export const Types = {
    Pool: 0,
    Farm: 1
}

export const DepositTypes = {
    TOKEN: 0,
    PLS: 1
}


export let farms = [
    {
        orderById: 1,
        displayName: 'CALI/PLS v2',
        lpAbbreviation: 'LP ',
        poolId: 0,
        stakingToken: '0xb620f728e3C87350cA9360a1c8dcCbb2B2e2c801',
        liquidityLink: 'https://pulsex.mypinata.cloud/ipfs/bafybeidea3ibq4lu5t6vk6ihp4iuznjb3ltsdm5y2shv4atxgyd3d33aim/#/add/V2/0x898515c05794e195b4BA11c3e4e5A6d3c2a44FeC/PLS',
        depositFee: 1,
        withdrawFee: 1,
        poolWeight: 5,
        isActive: true,
        compound: false,
        zaps: false,
        type: Types.Farm,
        oracle: Oracles.PULSEX_V2
    },

    {
        orderById: 2,
        displayName: 'ORGN/PLS v2',
        lpAbbreviation: 'LP ',
        poolId: 1,
        stakingToken: '0x574B25664508A1CAbd6f1aF3EB6386EBDe506942',
        liquidityLink: 'https://pulsex.mypinata.cloud/ipfs/bafybeidea3ibq4lu5t6vk6ihp4iuznjb3ltsdm5y2shv4atxgyd3d33aim/#/add/V2/0x3EE45593614D8A7Bed8D89cA5B4c39BA3f29C5a5/PLS',
        depositFee: 1,
        withdrawFee: 1,
        poolWeight: 5,
        isActive: true,
        compound: false,
        zaps: false,
        type: Types.Farm,
        oracle: Oracles.PULSEX_V2
    },

    {
        orderById: 3,
        displayName: 'ORGN/PLSPUP v2',
        lpAbbreviation: 'LP',
        poolId: 2,
        stakingToken: '0x80A2fF0E7768AF877FB4e9D57f27CFC4A0865Ddc',
        liquidityLink: 'https://pulsex.mypinata.cloud/ipfs/bafybeidea3ibq4lu5t6vk6ihp4iuznjb3ltsdm5y2shv4atxgyd3d33aim/#/add/V2/0x3F34B61FC145bdeC63c75f17deaDBD89e5E7c8af/PLS',
        depositFee: 1,
        withdrawFee: 1,
        poolWeight: 5,
        isActive: true,
        compound: false,
        zaps: false,
        type: Types.Farm,
        oracle: Oracles.PULSEX_V2
    },

    {
        orderById: 4,
        displayName: 'E.DAI/PLS v1',
        lpAbbreviation: 'LP',
        poolId: 3,
        stakingToken: '0xE56043671df55dE5CDf8459710433C10324DE0aE',
        liquidityLink: 'https://pulsex.mypinata.cloud/ipfs/bafybeidea3ibq4lu5t6vk6ihp4iuznjb3ltsdm5y2shv4atxgyd3d33aim/#/add/V1/PLS/0xefD766cCb38EaF1dfd701853BFCe31359239F305',
        depositFee: 1,
        withdrawFee: 1,
        poolWeight: 3,
        isActive: true,
        compound: false,
        zaps: false,
        type: Types.Farm,
        oracle: Oracles.PULSEX_V1
    },

    {
        orderById: 4,
        displayName: 'Abyss/PLS v2',
        lpAbbreviation: 'LP',
        poolId: 3,
        stakingToken: '0xE56043671df55dE5CDf8459710433C10324DE0aE',
        liquidityLink: 'https://pulsex.mypinata.cloud/ipfs/bafybeidea3ibq4lu5t6vk6ihp4iuznjb3ltsdm5y2shv4atxgyd3d33aim/#/add/V1/PLS/0xefD766cCb38EaF1dfd701853BFCe31359239F305',
        depositFee: 1,
        withdrawFee: 1,
        poolWeight: 3,
        isActive: true,
        compound: false,
        zaps: false,
        type: Types.Farm,
        oracle: Oracles.PULSEX_V1
    },

    {
        orderById: 1,
        displayName: 'ORGN',
        lpAbbreviation: 'ORGN',
        poolId: 6,
        stakingToken: '0x6386704cD6f7A584EA9D23cccA66aF7EBA5a727e',
        liquidityLink: 'https://pulsex.mypinata.cloud/ipfs/bafybeidea3ibq4lu5t6vk6ihp4iuznjb3ltsdm5y2shv4atxgyd3d33aim/#/?outputCurrency=0x6386704cD6f7A584EA9D23cccA66aF7EBA5a727e',
        depositFee: 1,
        withdrawFee: 1,
        poolWeight: 2,
        isActive: true,
        compound: false,
        zaps: false,
        type: Types.Pool,
        oracle: Oracles.PULSEX_V1
    },

    {
        orderById: 2,
        displayName: 'Glass',
        lpAbbreviation: 'Glass',
        poolId: 7,
        stakingToken: '0xd687FF2C9C5294f4A2bC0300B46eA921dB312063',
        liquidityLink: 'https://pulsex.mypinata.cloud/ipfs/bafybeidea3ibq4lu5t6vk6ihp4iuznjb3ltsdm5y2shv4atxgyd3d33aim/#/?outputCurrency=0xd687FF2C9C5294f4A2bC0300B46eA921dB312063',
        depositFee: 1,
        withdrawFee: 1,
        poolWeight: 2,
        isActive: true,
        compound: false,
        zaps: false,
        type: Types.Pool,
        oracle: Oracles.PULSEX_V1
    },

    {
        orderById: 3,
        displayName: 'pDAI',
        lpAbbreviation: 'pDAI',
        poolId: 8,
        stakingToken: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        liquidityLink: 'https://pulsex.mypinata.cloud/ipfs/bafybeidea3ibq4lu5t6vk6ihp4iuznjb3ltsdm5y2shv4atxgyd3d33aim/#/?outputCurrency=0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        depositFee: 1,
        withdrawFee: 1,
        poolWeight: 1,
        isActive: true,
        compound: false,
        zaps: false,
        type: Types.Pool,
        oracle: Oracles.PULSEX_V2
    },

    {
        orderById: 4,
        displayName: 'EMP',
        lpAbbreviation: 'EMP',
        poolId: 9,
        stakingToken: '0x9231937aC31506B6913ac5fb1DB5a1C1AE83783A',
        liquidityLink: 'https://pulsex.mypinata.cloud/ipfs/bafybeidea3ibq4lu5t6vk6ihp4iuznjb3ltsdm5y2shv4atxgyd3d33aim/#/?outputCurrency=0x9231937aC31506B6913ac5fb1DB5a1C1AE83783A',
        depositFee: 1,
        withdrawFee: 1,
        poolWeight: 2,
        isActive: true,
        compound: false,
        zaps: false,
        type: Types.Pool,
        oracle: Oracles.PULSEX_V2
    }


]