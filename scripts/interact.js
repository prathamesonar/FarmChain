const hre = require("hardhat");

async function main() {
  console.log("🧪 Testing SupplyChain Contract Interaction\n");

  // Get contract address from deployments
  const network = hre.network.name;
  let contractAddress;

  try {
    const fs = require("fs");
    const deploymentInfo = JSON.parse(
      fs.readFileSync(`./deployments/${network}.json`, "utf8")
    );
    contractAddress = deploymentInfo.contractAddress;
  } catch (error) {
    console.error("❌ Contract not deployed on this network");
    console.log("💡 Deploy first: npx hardhat run scripts/deploy.js --network", network);
    process.exit(1);
  }

  console.log(`📍 Contract Address: ${contractAddress}`);

  // Get signers (test accounts)
  const [farmer, distributor, retailer] = await hre.ethers.getSigners();

  console.log("\n👥 Test Accounts:");
  console.log(`   Farmer:      ${farmer.address}`);
  console.log(`   Distributor: ${distributor.address}`);
  console.log(`   Retailer:    ${retailer.address}\n`);

  // Get contract instance
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");
  const supplyChain = SupplyChain.attach(contractAddress);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🌾 Test 1: Create Batch (Farmer)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const batchId = `AG-${Date.now()}`;
  const cropType = "Tomato";
  const quantity = 1000;
  const qualityGrade = "A+";

  console.log(`Creating batch: ${batchId}`);
  const tx1 = await supplyChain.connect(farmer).addBatch(
    batchId,
    cropType,
    quantity,
    qualityGrade
  );

  console.log(`⏳ Transaction sent: ${tx1.hash}`);
  const receipt1 = await tx1.wait();
  console.log(`✅ Batch created! Gas used: ${receipt1.gasUsed.toString()}\n`);

  // Verify batch
  const [exists, owner, status] = await supplyChain.verifyBatch(batchId);
  console.log("📋 Batch Verification:");
  console.log(`   Exists: ${exists}`);
  console.log(`   Owner: ${owner}`);
  console.log(`   Status: ${status}\n`);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🚚 Test 2: Transfer to Distributor");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log(`Transferring ${batchId} to distributor...`);
  const tx2 = await supplyChain.connect(farmer).transferBatchOwnership(
    batchId,
    distributor.address
  );

  console.log(`⏳ Transaction sent: ${tx2.hash}`);
  const receipt2 = await tx2.wait();
  console.log(`✅ Ownership transferred! Gas used: ${receipt2.gasUsed.toString()}\n`);

  // Get ownership history
  const history = await supplyChain.getBatchHistory(batchId);
  console.log("📜 Ownership History:");
  history.forEach((addr, index) => {
    const label = index === 0 ? "Farmer" : index === 1 ? "Distributor" : "Retailer";
    console.log(`   ${index + 1}. ${label}: ${addr}`);
  });
  console.log();

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📦 Test 3: Update Status (Distributor)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("Updating batch status to 'In Transit'...");
  const tx3 = await supplyChain.connect(distributor).updateBatchStatus(
    batchId,
    "In Transit"
  );

  console.log(`⏳ Transaction sent: ${tx3.hash}`);
  const receipt3 = await tx3.wait();
  console.log(`✅ Status updated! Gas used: ${receipt3.gasUsed.toString()}\n`);

  // Get status history
  const statusHistory = await supplyChain.getBatchStatusHistory(batchId);
  console.log("📊 Status History:");
  statusHistory.forEach((stat, index) => {
    console.log(`   ${index + 1}. ${stat}`);
  });
  console.log();

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🏪 Test 4: Transfer to Retailer");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log(`Transferring ${batchId} to retailer...`);
  const tx4 = await supplyChain.connect(distributor).transferBatchOwnership(
    batchId,
    retailer.address
  );

  console.log(`⏳ Transaction sent: ${tx4.hash}`);
  const receipt4 = await tx4.wait();
  console.log(`✅ Ownership transferred! Gas used: ${receipt4.gasUsed.toString()}\n`);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("🔬 Test 5: Add Quality Report (Retailer)");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("Adding quality report...");
  const tx5 = await supplyChain.connect(retailer).addQualityReport(
    batchId,
    "A"
  );

  console.log(`⏳ Transaction sent: ${tx5.hash}`);
  const receipt5 = await tx5.wait();
  console.log(`✅ Quality report added! Gas used: ${receipt5.gasUsed.toString()}\n`);

  // Final verification
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("📊 Final Batch State");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  const batch = await supplyChain.batches(batchId);
  const finalHistory = await supplyChain.getBatchHistory(batchId);
  const finalStatusHistory = await supplyChain.getBatchStatusHistory(batchId);

  console.log(`Batch ID:        ${batch.batchId}`);
  console.log(`Crop Type:       ${batch.cropType}`);
  console.log(`Quantity:        ${batch.quantity.toString()}`);
  console.log(`Quality Grade:   ${batch.qualityGrade}`);
  console.log(`Current Owner:   ${batch.currentOwner}`);
  console.log(`Status:          ${batch.status}`);
  console.log(`Active:          ${batch.isActive}`);
  console.log(`\nOwnership Chain: ${finalHistory.length} transfers`);
  console.log(`Status Updates:  ${finalStatusHistory.length} changes\n`);

  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("✅ All Tests Passed! 🎉");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  console.log("💡 Total Gas Used:");
  const totalGas = 
    receipt1.gasUsed +
    receipt2.gasUsed +
    receipt3.gasUsed +
    receipt4.gasUsed +
    receipt5.gasUsed;
  console.log(`   ${totalGas.toString()} gas\n`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Test Failed:");
    console.error(error);
    process.exit(1);
  });
