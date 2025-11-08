const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const network = hre.network.name;
  console.log(`\n🔍 Verifying contract on ${network}...\n`);

  // Read deployment info
  const deploymentFile = path.join(__dirname, `../deployments/${network}.json`);
  
  if (!fs.existsSync(deploymentFile)) {
    console.error(`❌ Deployment file not found: deployments/${network}.json`);
    console.log("💡 Deploy the contract first: npx hardhat run scripts/deploy.js --network", network);
    process.exit(1);
  }

  const deploymentInfo = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  const contractAddress = deploymentInfo.contractAddress;

  console.log(`📋 Verifying SupplyChain at: ${contractAddress}\n`);

  try {
    await hre.run("verify:verify", {
      address: contractAddress,
      constructorArguments: [],
    });

    console.log("✅ Contract verified successfully!\n");
    
    // Add verified status to deployment info
    deploymentInfo.verified = true;
    deploymentInfo.verifiedAt = new Date().toISOString();
    fs.writeFileSync(deploymentFile, JSON.stringify(deploymentInfo, null, 2));

  } catch (error) {
    if (error.message.includes("Already Verified")) {
      console.log("✅ Contract already verified!\n");
    } else {
      console.error("❌ Verification failed:");
      console.error(error.message);
      process.exit(1);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
