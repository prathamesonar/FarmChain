const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting FarmChain Smart Contract Deployment...\n");

  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;

  console.log("📋 Deployment Details:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Network: ${network}`);
  console.log(`Deployer: ${deployer.address}`);
  
  // Check balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Balance: ${hre.ethers.formatEther(balance)} ETH`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Check if balance is sufficient
  if (network !== "hardhat" && network !== "localhost") {
    if (balance === 0n) {
      console.error("❌ Insufficient balance for deployment!");
      console.log(`\n💡 Get testnet ETH:`);
      console.log(`   Sepolia: https://sepoliafaucet.com/`);
      console.log(`   Mumbai: https://faucet.polygon.technology/`);
      process.exit(1);
    }
  }

  // Deploy SupplyChain contract
  console.log("📦 Deploying SupplyChain contract...");
  
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy();
  
  await supplyChain.waitForDeployment();
  const contractAddress = await supplyChain.getAddress();

  console.log("✅ SupplyChain deployed successfully!");
  console.log(`📍 Contract Address: ${contractAddress}\n`);

  // Wait for block confirmations on testnets
  if (network !== "hardhat" && network !== "localhost") {
    console.log("⏳ Waiting for block confirmations...");
    await supplyChain.deploymentTransaction().wait(6);
    console.log("✅ Confirmed!\n");
  }

  // Prepare deployment info
  const deploymentInfo = {
    network: network,
    contractAddress: contractAddress,
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
    blockNumber: await hre.ethers.provider.getBlockNumber(),
    transactionHash: supplyChain.deploymentTransaction().hash
  };

  // Save deployment info to file
  const deploymentsDir = path.join(__dirname, "../deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `${network}.json`);
  fs.writeFileSync(
    deploymentFile,
    JSON.stringify(deploymentInfo, null, 2)
  );

  console.log("📝 Deployment Info Saved:");
  console.log(`   File: deployments/${network}.json\n`);

  // Update backend .env file
  const backendEnvPath = path.join(__dirname, "../backend/.env");
  if (fs.existsSync(backendEnvPath)) {
    let envContent = fs.readFileSync(backendEnvPath, "utf8");
    
    // Update or add CONTRACT_ADDRESS
    if (envContent.includes("CONTRACT_ADDRESS=")) {
      envContent = envContent.replace(
        /CONTRACT_ADDRESS=.*/,
        `CONTRACT_ADDRESS=${contractAddress}`
      );
    } else {
      envContent += `\nCONTRACT_ADDRESS=${contractAddress}\n`;
    }

    fs.writeFileSync(backendEnvPath, envContent);
    console.log("✅ Backend .env updated with contract address\n");
  }

  // Print summary
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 Deployment Summary");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Network:          ${network}`);
  console.log(`Contract:         SupplyChain`);
  console.log(`Address:          ${contractAddress}`);
  console.log(`Deployer:         ${deployer.address}`);
  console.log(`Transaction:      ${deploymentInfo.transactionHash}`);
  console.log(`Block Number:     ${deploymentInfo.blockNumber}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Verification instructions
  if (network === "sepolia" || network === "mumbai") {
    console.log("🔍 To verify on block explorer:");
    console.log(`   npx hardhat verify --network ${network} ${contractAddress}\n`);
  }

  // Next steps
  console.log("🎯 Next Steps:");
  console.log("   1. Update backend/.env with CONTRACT_ADDRESS (already done ✅)");
  console.log("   2. Test contract: npx hardhat test");
  console.log("   3. Start backend: cd backend && npm run dev");
  console.log("   4. Integrate blockchain service in backend\n");

  console.log("✅ Deployment Complete! 🎉\n");
}

// Execute deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deployment Failed:");
    console.error(error);
    process.exit(1);
  });
