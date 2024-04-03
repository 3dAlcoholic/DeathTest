import { readContract, prepareWriteContract, writeContract, waitForTransaction } from '@wagmi/core';
import MasterChefABI from '$lib/abi/MasterChef.json';
import { MASTERCHEF_ADDRESS } from '$lib/config';

export const poolLength = async() => {
    const data = await readContract({
        address: MASTERCHEF_ADDRESS,
        abi: MasterChefABI,
        functionName: 'poolLength',
    })
    return data;
}

export const rewardsPerSec = async() => {
    const data = await readContract({
        address: MASTERCHEF_ADDRESS,
        abi: MasterChefABI,
        functionName: 'rewardsPerSec',
    });
    return data;
}

export const totalAllocPoint = async() => {
    const data = await readContract({
        address: MASTERCHEF_ADDRESS,
        abi: MasterChefABI,
        functionName: 'totalAllocPoint',
    });
    return data;
}

export const userInfo = async(poolId, userAddress) => {
    const data = await readContract({
        address: MASTERCHEF_ADDRESS,
        abi: MasterChefABI,
        functionName: 'userInfo',
        args: [poolId, userAddress]
    })
    return data;
}

export const poolInfo = async(poolId) => {
    const data = await readContract({
        address: MASTERCHEF_ADDRESS,
        abi: MasterChefABI,
        functionName: 'poolInfo',
        args: [poolId]
    })
    return data;
}

export const pendingRewards = async(poolId, userAddress) => {
    const data = await readContract({
        address: MASTERCHEF_ADDRESS,
        abi: MasterChefABI,
        functionName: 'pendingRewards',
        args: [poolId, userAddress]
    })
    return data;
}

export const deposit = async(poolId, amount) => {
    const config = await prepareWriteContract({
        address: MASTERCHEF_ADDRESS,
        abi: MasterChefABI,
        functionName: 'deposit',
        args: [poolId, amount]
    });
    return (await writeContract(config));
}

export const withdraw = async(poolId, amount) => {
    const config = await prepareWriteContract({
        address: MASTERCHEF_ADDRESS,
        abi: MasterChefABI,
        functionName: 'withdraw',
        args: [poolId, amount]
    })
    return (await writeContract(config));
}

export const claim = async(poolId) => {
    const config = await prepareWriteContract({
        address: MASTERCHEF_ADDRESS,
        abi: MasterChefABI,
        functionName: 'deposit',
        args: [poolId, 0]
    })
    return (await writeContract(config));
}