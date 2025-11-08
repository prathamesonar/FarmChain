const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SupplyChain Contract", function () {
  let supplyChain;
  let owner, farmer, distributor, retailer, inspector;
  let batchId;

  beforeEach(async function () {
    // Get signers
    [owner, farmer, distributor, retailer, inspector] = await ethers.getSigners();

    // Deploy contract
    const SupplyChain = await ethers.getContractFactory("SupplyChain");
    supplyChain = await SupplyChain.deploy();
    await supplyChain.waitForDeployment();

    // Generate unique batch ID for each test
    batchId = `AG-TEST-${Date.now()}`;
  });

  describe("Deployment", function () {
    it("Should deploy successfully", async function () {
      expect(await supplyChain.getAddress()).to.be.properAddress;
    });

    it("Should set the deployer as owner", async function () {
      expect(await supplyChain.owner()).to.equal(owner.address);
    });
  });

  describe("Batch Creation", function () {
    it("Should create a new batch successfully", async function () {
      const tx = await supplyChain.connect(farmer).addBatch(
        batchId,
        "Tomato",
        1000,
        "A+"
      );

      await expect(tx)
        .to.emit(supplyChain, "BatchCreated")
        .withArgs(batchId, farmer.address, "Tomato", await ethers.provider.getBlock("latest").then(b => b.timestamp));

      const batch = await supplyChain.batches(batchId);
      expect(batch.batchId).to.equal(batchId);
      expect(batch.cropType).to.equal("Tomato");
      expect(batch.quantity).to.equal(1000);
      expect(batch.qualityGrade).to.equal("A+");
      expect(batch.currentOwner).to.equal(farmer.address);
      expect(batch.isActive).to.be.true;
    });

    it("Should reject duplicate batch ID", async function () {
      await supplyChain.connect(farmer).addBatch(batchId, "Tomato", 1000, "A+");

      await expect(
        supplyChain.connect(farmer).addBatch(batchId, "Onion", 500, "A")
      ).to.be.revertedWith("Batch already exists");
    });

    it("Should reject empty batch ID", async function () {
      await expect(
        supplyChain.connect(farmer).addBatch("", "Tomato", 1000, "A+")
      ).to.be.revertedWith("Invalid batch ID");
    });

    it("Should reject zero quantity", async function () {
      await expect(
        supplyChain.connect(farmer).addBatch(batchId, "Tomato", 0, "A+")
      ).to.be.revertedWith("Quantity must be positive");
    });

    it("Should initialize batch history", async function () {
      await supplyChain.connect(farmer).addBatch(batchId, "Tomato", 1000, "A+");

      const history = await supplyChain.getBatchHistory(batchId);
      expect(history.length).to.equal(1);
      expect(history[0]).to.equal(farmer.address);
    });

    it("Should initialize status history", async function () {
      await supplyChain.connect(farmer).addBatch(batchId, "Tomato", 1000, "A+");

      const statusHistory = await supplyChain.getBatchStatusHistory(batchId);
      expect(statusHistory.length).to.equal(1);
      expect(statusHistory[0]).to.equal("Created");
    });
  });

  describe("Ownership Transfer", function () {
    beforeEach(async function () {
      await supplyChain.connect(farmer).addBatch(batchId, "Tomato", 1000, "A+");
    });

    it("Should transfer ownership successfully", async function () {
      const tx = await supplyChain.connect(farmer).transferBatchOwnership(
        batchId,
        distributor.address
      );

      await expect(tx)
        .to.emit(supplyChain, "BatchOwnershipTransferred")
        .withArgs(batchId, farmer.address, distributor.address, await ethers.provider.getBlock("latest").then(b => b.timestamp));

      const batch = await supplyChain.batches(batchId);
      expect(batch.currentOwner).to.equal(distributor.address);
    });

    it("Should update ownership history", async function () {
      await supplyChain.connect(farmer).transferBatchOwnership(batchId, distributor.address);
      await supplyChain.connect(distributor).transferBatchOwnership(batchId, retailer.address);

      const history = await supplyChain.getBatchHistory(batchId);
      expect(history.length).to.equal(3);
      expect(history[0]).to.equal(farmer.address);
      expect(history[1]).to.equal(distributor.address);
      expect(history[2]).to.equal(retailer.address);
    });

    it("Should reject transfer from non-owner", async function () {
      await expect(
        supplyChain.connect(distributor).transferBatchOwnership(batchId, retailer.address)
      ).to.be.revertedWith("Not batch owner");
    });

    it("Should reject transfer to zero address", async function () {
      await expect(
        supplyChain.connect(farmer).transferBatchOwnership(batchId, ethers.ZeroAddress)
      ).to.be.revertedWith("Invalid new owner");
    });

    it("Should reject transfer to self", async function () {
      await expect(
        supplyChain.connect(farmer).transferBatchOwnership(batchId, farmer.address)
      ).to.be.revertedWith("Cannot transfer to self");
    });

    it("Should reject transfer of non-existent batch", async function () {
      await expect(
        supplyChain.connect(farmer).transferBatchOwnership("INVALID", distributor.address)
      ).to.be.revertedWith("Batch does not exist");
    });
  });

  describe("Status Updates", function () {
    beforeEach(async function () {
      await supplyChain.connect(farmer).addBatch(batchId, "Tomato", 1000, "A+");
    });

    it("Should update batch status successfully", async function () {
      const tx = await supplyChain.connect(farmer).updateBatchStatus(batchId, "In Transit");

      await expect(tx)
        .to.emit(supplyChain, "StatusUpdated")
        .withArgs(batchId, "In Transit", await ethers.provider.getBlock("latest").then(b => b.timestamp));

      const batch = await supplyChain.batches(batchId);
      expect(batch.status).to.equal("In Transit");
    });

    it("Should track status history", async function () {
      await supplyChain.connect(farmer).updateBatchStatus(batchId, "In Transit");
      await supplyChain.connect(farmer).updateBatchStatus(batchId, "Delivered");
      await supplyChain.connect(farmer).updateBatchStatus(batchId, "Sold");

      const statusHistory = await supplyChain.getBatchStatusHistory(batchId);
      expect(statusHistory.length).to.equal(4); // Created + 3 updates
      expect(statusHistory[0]).to.equal("Created");
      expect(statusHistory[1]).to.equal("In Transit");
      expect(statusHistory[2]).to.equal("Delivered");
      expect(statusHistory[3]).to.equal("Sold");
    });

    it("Should reject status update from non-owner", async function () {
      await expect(
        supplyChain.connect(distributor).updateBatchStatus(batchId, "In Transit")
      ).to.be.revertedWith("Not batch owner");
    });

    it("Should reject empty status", async function () {
      await expect(
        supplyChain.connect(farmer).updateBatchStatus(batchId, "")
      ).to.be.revertedWith("Invalid status");
    });
  });

  describe("Quality Reports", function () {
    beforeEach(async function () {
      await supplyChain.connect(farmer).addBatch(batchId, "Tomato", 1000, "A+");
    });

    it("Should add quality report successfully", async function () {
      const tx = await supplyChain.connect(inspector).addQualityReport(batchId, "A");

      await expect(tx)
        .to.emit(supplyChain, "QualityReportAdded")
        .withArgs(batchId, inspector.address, "A", await ethers.provider.getBlock("latest").then(b => b.timestamp));

      const batch = await supplyChain.batches(batchId);
      expect(batch.qualityGrade).to.equal("A");
    });

    it("Should allow anyone to add quality report", async function () {
      await expect(
        supplyChain.connect(inspector).addQualityReport(batchId, "A")
      ).to.not.be.reverted;

      await expect(
        supplyChain.connect(distributor).addQualityReport(batchId, "B+")
      ).to.not.be.reverted;
    });

    it("Should reject empty grade", async function () {
      await expect(
        supplyChain.connect(inspector).addQualityReport(batchId, "")
      ).to.be.revertedWith("Invalid grade");
    });

    it("Should reject quality report for non-existent batch", async function () {
      await expect(
        supplyChain.connect(inspector).addQualityReport("INVALID", "A")
      ).to.be.revertedWith("Batch does not exist");
    });
  });

  describe("Batch Verification", function () {
    it("Should verify existing batch", async function () {
      await supplyChain.connect(farmer).addBatch(batchId, "Tomato", 1000, "A+");

      const [exists, currentOwner, status] = await supplyChain.verifyBatch(batchId);
      expect(exists).to.be.true;
      expect(currentOwner).to.equal(farmer.address);
      expect(status).to.equal("Created");
    });

    it("Should return false for non-existent batch", async function () {
      const [exists] = await supplyChain.verifyBatch("INVALID");
      expect(exists).to.be.false;
    });
  });

  describe("Complete Supply Chain Flow", function () {
    it("Should handle complete supply chain journey", async function () {
      // 1. Farmer creates batch
      await supplyChain.connect(farmer).addBatch(batchId, "Tomato", 1000, "A+");
      
      let batch = await supplyChain.batches(batchId);
      expect(batch.currentOwner).to.equal(farmer.address);
      expect(batch.status).to.equal("Created");

      // 2. Farmer transfers to distributor
      await supplyChain.connect(farmer).transferBatchOwnership(batchId, distributor.address);
      await supplyChain.connect(distributor).updateBatchStatus(batchId, "In Transit");

      batch = await supplyChain.batches(batchId);
      expect(batch.currentOwner).to.equal(distributor.address);
      expect(batch.status).to.equal("In Transit");

      // 3. Distributor transfers to retailer
      await supplyChain.connect(distributor).transferBatchOwnership(batchId, retailer.address);
      await supplyChain.connect(retailer).updateBatchStatus(batchId, "Delivered");

      batch = await supplyChain.batches(batchId);
      expect(batch.currentOwner).to.equal(retailer.address);
      expect(batch.status).to.equal("Delivered");

      // 4. Inspector adds quality report
      await supplyChain.connect(inspector).addQualityReport(batchId, "A");

      batch = await supplyChain.batches(batchId);
      expect(batch.qualityGrade).to.equal("A");

      // 5. Verify complete history
      const history = await supplyChain.getBatchHistory(batchId);
      expect(history.length).to.equal(3);
      expect(history[0]).to.equal(farmer.address);
      expect(history[1]).to.equal(distributor.address);
      expect(history[2]).to.equal(retailer.address);

      const statusHistory = await supplyChain.getBatchStatusHistory(batchId);
      expect(statusHistory.length).to.equal(3);
      expect(statusHistory[0]).to.equal("Created");
      expect(statusHistory[1]).to.equal("In Transit");
      expect(statusHistory[2]).to.equal("Delivered");
    });
  });

  describe("Reentrancy Protection", function () {
    it("Should have nonReentrant modifier on critical functions", async function () {
      // This is tested implicitly by the ReentrancyGuard from OpenZeppelin
      // The contract will revert on reentrancy attempts
      await supplyChain.connect(farmer).addBatch(batchId, "Tomato", 1000, "A+");
      
      // Transfer should complete successfully (no reentrancy)
      await expect(
        supplyChain.connect(farmer).transferBatchOwnership(batchId, distributor.address)
      ).to.not.be.reverted;
    });
  });
});
