import { ethers } from "hardhat";

async function main() {
  // Contract and token holder addresses
  const ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";
  const TOKEN_HOLDER = "0x82810e81CAD10B8032D39758C8DBa3bA47Ad7092";

  // Token addresses
  const USDT_ADDRESS = "0xdac17f958d2ee523a2206206994597c13d831ec7";
  const WETH_ADDRESS = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"; // WETH

  const impersonatedSigner = await ethers.getImpersonatedSigner(TOKEN_HOLDER);

  // Deploy contracts using interfaces
  const ROUTER = await ethers.getContractAt(
    "IUniswapV2Router02",
    ROUTER_ADDRESS,
    impersonatedSigner
  );
  const USDT_CONTRACT = await ethers.getContractAt(
    "IERC20",
    USDT_ADDRESS,
    impersonatedSigner
  );
  const WETH_CONTRACT = await ethers.getContractAt(
    "IERC20",
    WETH_ADDRESS,
    impersonatedSigner
  );

  await USDT_CONTRACT.approve(ROUTER, ethers.parseUnits("1000", 6));

  // **** SWAP ETH FOR EXACT TOKENS **** //

  const amountInMax = ethers.parseEther("0.1"); // Ether
  const amountOut = ethers.parseUnits("200", 6); // USDT tokens
  const deadline = Math.floor(Date.now() / 1000) + 60 * 5;

  const usdtBal = await USDT_CONTRACT.balanceOf(impersonatedSigner.address);
  const ethBal = await ethers.provider.getBalance(impersonatedSigner.address);

  console.log("================================================");

  console.log("USDT Balance Before Swap1:", ethers.formatUnits(usdtBal, 6));
  console.log("ETH Balance Before Swap1:", ethers.formatEther(ethBal));

  await ROUTER.swapETHForExactTokens(
    amountOut,
    [WETH_ADDRESS, USDT_ADDRESS],
    impersonatedSigner.address,
    deadline,
    { value: amountInMax }
  );

  const usdtBalAfter = await USDT_CONTRACT.balanceOf(
    impersonatedSigner.address
  );
  const ethBalAfter = await ethers.provider.getBalance(
    impersonatedSigner.address
  );

  console.log("================================================");

  console.log("USDT Balance After Swap1:", ethers.formatUnits(usdtBalAfter, 6));
  console.log("ETH Balance After Swap1:", ethers.formatEther(ethBalAfter));

  // *** SWAP EXACT ETH FOR TOKENS *** //

  const amountIn = ethers.parseEther("0.1");
  const amountOutMin = ethers.parseUnits("200", 6);

  const usdtBalBeforeSwap = await USDT_CONTRACT.balanceOf(
    impersonatedSigner.address
  );
  const ethBalBeforeSwap = await ethers.provider.getBalance(
    impersonatedSigner.address
  );

  console.log("================================================");

  console.log(
    `USDT Balance Before Swap2: ${ethers.formatUnits(usdtBalBeforeSwap, 6)}`
  );
  console.log(
    `ETH Balance Before Swap2: ${ethers.formatEther(ethBalBeforeSwap)}`
  );

  await ROUTER.swapExactETHForTokens(
    amountOutMin,
    [WETH_ADDRESS, USDT_ADDRESS],
    impersonatedSigner.address,
    deadline,
    { value: amountIn }
  );

  const usdtBalAfterSwap = await USDT_CONTRACT.balanceOf(
    impersonatedSigner.address
  );
  const ethBalAfterSwap = await ethers.provider.getBalance(
    impersonatedSigner.address
  );

  console.log("================================================");

  console.log(
    `USDT Balance After Swap2: ${ethers.formatUnits(usdtBalAfterSwap, 6)}`
  );
  console.log(
    `ETH Balance After Swap2: ${ethers.formatEther(ethBalAfterSwap)}`
  );

  console.log("================================================");
}

main().catch((error) => {
  console.log(error);
  process.exit(1);
});
