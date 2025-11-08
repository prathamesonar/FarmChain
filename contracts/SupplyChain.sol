// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SupplyChain
 * @dev Main contract for agricultural supply chain tracking
 * @custom:security-contact security@farmchain.com
 */
contract SupplyChain is Ownable, ReentrancyGuard {
    constructor() Ownable(msg.sender) {}
    // Structs
    struct Batch {
        string batchId;
        string cropType;
        uint256 quantity;
        string qualityGrade;
        address currentOwner;
        bool isActive;
        uint256 createdAt;
        string status;
    }

    // State variables
    mapping(string => Batch) public batches;
    mapping(string => address[]) public batchHistory;
    mapping(string => string[]) public batchStatusHistory;

    // Events
    event BatchCreated(string batchId, address indexed farmer, string cropType, uint256 timestamp);
    event BatchOwnershipTransferred(string batchId, address indexed from, address indexed to, uint256 timestamp);
    event StatusUpdated(string batchId, string status, uint256 timestamp);
    event QualityReportAdded(string batchId, address indexed inspector, string grade, uint256 timestamp);

    // Modifiers
    modifier batchExists(string memory _batchId) {
        require(batches[_batchId].createdAt != 0, "Batch does not exist");
        _;
    }

    modifier onlyBatchOwner(string memory _batchId) {
        require(batches[_batchId].currentOwner == msg.sender, "Not batch owner");
        _;
    }

    /**
     * @dev Creates a new batch of agricultural produce
     * @param _batchId Unique identifier for the batch
     * @param _cropType Type of crop
     * @param _quantity Quantity of the crop
     * @param _qualityGrade Initial quality grade
     */
    function addBatch(
        string memory _batchId,
        string memory _cropType,
        uint256 _quantity,
        string memory _qualityGrade
    ) external nonReentrant {
        require(batches[_batchId].createdAt == 0, "Batch already exists");
        require(bytes(_batchId).length > 0, "Invalid batch ID");
        require(_quantity > 0, "Quantity must be positive");

        Batch memory newBatch = Batch({
            batchId: _batchId,
            cropType: _cropType,
            quantity: _quantity,
            qualityGrade: _qualityGrade,
            currentOwner: msg.sender,
            isActive: true,
            createdAt: block.timestamp,
            status: "Created"
        });

        batches[_batchId] = newBatch;
        batchHistory[_batchId].push(msg.sender);
        batchStatusHistory[_batchId].push("Created");

        emit BatchCreated(_batchId, msg.sender, _cropType, block.timestamp);
    }

    /**
     * @dev Transfers ownership of a batch to a new owner
     * @param _batchId Batch identifier
     * @param _newOwner Address of the new owner
     */
    function transferBatchOwnership(string memory _batchId, address _newOwner) 
        external 
        batchExists(_batchId) 
        onlyBatchOwner(_batchId) 
        nonReentrant 
    {
        require(_newOwner != address(0), "Invalid new owner");
        require(_newOwner != msg.sender, "Cannot transfer to self");

        batches[_batchId].currentOwner = _newOwner;
        batchHistory[_batchId].push(_newOwner);

        emit BatchOwnershipTransferred(_batchId, msg.sender, _newOwner, block.timestamp);
    }

    /**
     * @dev Updates the status of a batch
     * @param _batchId Batch identifier
     * @param _status New status
     */
    function updateBatchStatus(string memory _batchId, string memory _status)
        external
        batchExists(_batchId)
        onlyBatchOwner(_batchId)
    {
        require(bytes(_status).length > 0, "Invalid status");
        batches[_batchId].status = _status;
        batchStatusHistory[_batchId].push(_status);

        emit StatusUpdated(_batchId, _status, block.timestamp);
    }

    /**
     * @dev Adds a quality report for a batch
     * @param _batchId Batch identifier
     * @param _grade New quality grade
     */
    function addQualityReport(string memory _batchId, string memory _grade)
        external
        batchExists(_batchId)
    {
        require(bytes(_grade).length > 0, "Invalid grade");
        batches[_batchId].qualityGrade = _grade;

        emit QualityReportAdded(_batchId, msg.sender, _grade, block.timestamp);
    }

    /**
     * @dev Gets the complete ownership history of a batch
     * @param _batchId Batch identifier
     * @return Array of addresses representing ownership history
     */
    function getBatchHistory(string memory _batchId) 
        external 
        view 
        batchExists(_batchId) 
        returns (address[] memory) 
    {
        return batchHistory[_batchId];
    }

    /**
     * @dev Gets the complete status history of a batch
     * @param _batchId Batch identifier
     * @return Array of strings representing status history
     */
    function getBatchStatusHistory(string memory _batchId)
        external
        view
        batchExists(_batchId)
        returns (string[] memory)
    {
        return batchStatusHistory[_batchId];
    }

    /**
     * @dev Verifies if a batch exists and returns its current status
     * @param _batchId Batch identifier
     * @return exists Boolean indicating if batch exists
     * @return currentOwner Address of current batch owner
     * @return status Current status string
     */
    function verifyBatch(string memory _batchId) 
        external 
        view 
        returns (bool exists, address currentOwner, string memory status) 
    {
        Batch memory batch = batches[_batchId];
        return (batch.createdAt != 0, batch.currentOwner, batch.status);
    }
}