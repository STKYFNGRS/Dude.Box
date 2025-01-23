// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

contract DudeToken is ERC20, Ownable, ERC20Permit, Pausable {
    uint256 public constant TOTAL_SUPPLY = 100_000_000 * 10**18; // 100M tokens
    
    uint256 public constant PUBLIC_SALE_SUPPLY = 40_000_000 * 10**18; // 40%
    uint256 public constant TEAM_SUPPLY = 10_000_000 * 10**18;       // 10%
    uint256 public constant ECOSYSTEM_SUPPLY = 30_000_000 * 10**18;  // 30%
    uint256 public constant LIQUIDITY_SUPPLY = 20_000_000 * 10**18;  // 20%

    uint256 public ecosystemReleased;
    uint256 public vestingStartTime;
    uint256 public constant VESTING_DURATION = 730 days; // 2 years

    address public liquidityWallet;
    address public teamWallet;
    address public ecosystemWallet;

    bool public liquidityLocked = true;
    uint256 public liquidityLockEnd;

    event TokensReleased(address indexed wallet, uint256 amount);
    event WalletsUpdated(address team, address liquidity, address ecosystem);

    constructor(
        address _teamWallet,
        address _liquidityWallet,
        address _ecosystemWallet
    ) ERC20("Dude Token", "DUDE") ERC20Permit("Dude Token") Ownable(msg.sender) {
        require(_teamWallet != address(0), "Invalid team wallet");
        require(_liquidityWallet != address(0), "Invalid liquidity wallet");
        require(_ecosystemWallet != address(0), "Invalid ecosystem wallet");

        teamWallet = _teamWallet;
        liquidityWallet = _liquidityWallet;
        ecosystemWallet = _ecosystemWallet;

        vestingStartTime = block.timestamp;
        liquidityLockEnd = block.timestamp + 730 days; // 2 year lock

        // Mint tokens for different allocations
        _mint(address(this), PUBLIC_SALE_SUPPLY); // Public sale tokens held by contract
        _mint(teamWallet, TEAM_SUPPLY);           // Team allocation
        _mint(liquidityWallet, LIQUIDITY_SUPPLY); // Liquidity allocation
        _mint(address(this), ECOSYSTEM_SUPPLY);   // Ecosystem tokens held by contract for vesting
    }

    function releaseEcosystemTokens() external {
        require(block.timestamp >= vestingStartTime, "Vesting not started");
        
        uint256 elapsedTime = block.timestamp - vestingStartTime;
        if (elapsedTime > VESTING_DURATION) {
            elapsedTime = VESTING_DURATION;
        }

        uint256 totalVestingAmount = (ECOSYSTEM_SUPPLY * elapsedTime) / VESTING_DURATION;
        uint256 remainingAmount = totalVestingAmount - ecosystemReleased;
        
        require(remainingAmount > 0, "No tokens to release");
        
        ecosystemReleased += remainingAmount;
        _transfer(address(this), ecosystemWallet, remainingAmount);
        
        emit TokensReleased(ecosystemWallet, remainingAmount);
    }

    function initiatePublicSale(address buyer, uint256 amount) external onlyOwner {
        require(amount <= balanceOf(address(this)), "Insufficient public sale tokens");
        _transfer(address(this), buyer, amount);
    }

    function withdrawLiquidity(uint256 amount) external {
        require(msg.sender == liquidityWallet, "Not liquidity wallet");
        require(!liquidityLocked || block.timestamp >= liquidityLockEnd, "Liquidity is locked");
        require(amount <= balanceOf(liquidityWallet), "Insufficient balance");
        _transfer(liquidityWallet, msg.sender, amount);
    }

    function updateWallets(
        address newTeamWallet,
        address newLiquidityWallet,
        address newEcosystemWallet
    ) external onlyOwner {
        require(newTeamWallet != address(0), "Invalid team wallet");
        require(newLiquidityWallet != address(0), "Invalid liquidity wallet");
        require(newEcosystemWallet != address(0), "Invalid ecosystem wallet");

        teamWallet = newTeamWallet;
        liquidityWallet = newLiquidityWallet;
        ecosystemWallet = newEcosystemWallet;

        emit WalletsUpdated(newTeamWallet, newLiquidityWallet, newEcosystemWallet);
    }

    // Emergency functions
    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    // Override transfer functions to check pause status
    function transfer(address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transfer(to, amount);
    }

    function transferFrom(address from, address to, uint256 amount) public override whenNotPaused returns (bool) {
        return super.transferFrom(from, to, amount);
    }
}