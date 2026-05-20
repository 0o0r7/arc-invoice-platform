# ARC Network - Comprehensive Knowledge Base (Updated May 2026)

**Last Updated:** 2026-05-20  
**Status:** Public Testnet Active | Mainnet Beta Summer 2026  
**Research Phase:** Complete Deep Dive + May 2026 Updates  
**Testnet Transactions:** 244.1M+ (as of May 2026)

---

## 1. EXECUTIVE SUMMARY

Arc is a Layer-1 blockchain purpose-built by Circle to unite programmable money and onchain innovation with real-world economic activity. It serves as the "Economic OS for the internet," enabling institutional-grade finance through stablecoin-native infrastructure.

**Key Differentiators:**
- Stablecoin-based gas fees (USDC) for predictable, fiat-denominated costs
- Deterministic sub-second finality via Malachite consensus engine
- Opt-in configurable privacy with compliance auditability
- Direct integration with Circle's full-stack platform
- EVM-compatible for familiar developer tooling
- Post-quantum cryptographic security roadmap

**Current Status:** 
- Public Testnet: Active (Launched October 28, 2025)
- Mainnet Beta: Summer 2026 (Official Target)
- Testnet Performance: 244.1M+ transactions processed

**Recent Milestone (May 2026):**
- Circle closed $222M Series A funding at $3B FDV
- Investors: a16z Crypto, BlackRock, Apollo, Intercontinental Exchange

---

## 2. CORE ARCHITECTURE

### 2.1 Consensus Layer
- **Engine:** Malachite (BFT-based)
- **Type:** Byzantine Fault Tolerance (BFT) consensus
- **Finality:** Deterministic, sub-second (< 1 second)
- **Block Time:** ~500ms deterministic finality
- **Validator Model:** Permissioned validator set for security and compliance
- **Network Access:** Fully open (permissionless for users/developers)
- **Quantum Resistance:** Post-quantum cryptography roadmap (phased rollout 2026-2028)

### 2.2 Execution Layer
- **Base:** Reth (Rust implementation of Ethereum execution client)
- **Compatibility:** Full EVM compatibility
- **Smart Contracts:** Deploy using familiar tools (Foundry, Hardhat, etc.)
- **State Management:** Maintains ledger and blockchain state
- **Performance:** High throughput optimized for stablecoin operations

### 2.3 Network Layer
- **Type:** P2P network
- **RPC Endpoints:** Multiple providers available
- **Block Explorers:** Blockscout-based explorers (testnet.arcscan.app)
- **Network Health:** Continuous monitoring and stability testing

### 2.4 Application Layer
- **dApps:** Full support for decentralized applications
- **APIs:** Developer-friendly APIs
- **Integration:** Direct Circle platform integration
- **Composability:** Support for cross-chain operations via CCTP

### 2.5 Incentive Layer
- **Gas Token:** USDC (native gas token) - stablecoin pricing
- **Fee Structure:** Stable, predictable fiat-based fees
- **Minimum Base Fee:** 160 Gwei (approximately $0.01 per transaction on testnet)
- **Transaction Limits:** V2 CCTP supports up to $10M transfers (upgraded from $1M)

---

## 3. TESTNET CONFIGURATION

### 3.1 Network Details
```
Network Name: Arc Testnet
RPC URL: https://rpc.testnet.arc.network
Chain ID: 5042002
Currency Symbol: USDC
Block Explorer: https://testnet.arcscan.app
Faucet: https://faucet.circle.com
Status: Active (244.1M+ transactions as of May 2026)
```

### 3.2 MetaMask Configuration
To add Arc Testnet to MetaMask:
1. Open MetaMask → Add Network
2. Enter the following:
   - **Network name:** Arc Testnet
   - **New RPC URL:** https://rpc.testnet.arc.network
   - **Chain ID:** 5042002
   - **Currency symbol:** USDC
   - **Explorer URL:** https://testnet.arcscan.app
3. Save and switch to Arc Testnet

### 3.3 Testnet Status & Reliability
- ✅ Active and stable network
- ✅ 244.1M+ transactions processed
- ✅ Sub-500ms block finality consistently maintained
- ✅ Stress testing completed for network congestion scenarios
- ⚠️ Pre-production environment - may have scheduled updates
- ℹ️ Bug bounty program active for security researchers

---

## 4. KEY FEATURES

### 4.1 Stable Fee Design
- **Gas Token:** USDC (stablecoin - no volatility exposure)
- **Benefits:** 
  - Predictable costs in fiat terms ($0.01 per transaction on testnet)
  - No volatility exposure for gas fees
  - Transparent pricing for institutional users
  - Cost-effective for high-volume operations
- **Reference:** [docs.arc.network/arc/references/gas-and-fees](https://docs.arc.network/arc/references/gas-and-fees)

### 4.2 Deterministic Finality
- **Speed:** Sub-second finality (< 1 second)
- **Type:** Deterministic (irreversible once confirmed)
- **Engine:** Malachite BFT consensus
- **Use Case:** Suitable for institutional settlement standards
- **Mechanism:** Byzantine Fault Tolerant consensus ensures no forks or rollbacks
- **Reference:** [docs.arc.network/arc/concepts/deterministic-finality](https://docs.arc.network/arc/concepts/deterministic-finality)

### 4.3 Opt-in Privacy
- **Type:** Configurable privacy tools (roadmap for mainnet)
- **Features:** 
  - Selective protection of sensitive financial data
  - Maintains auditability for compliance
  - Native privacy tools for users and businesses
  - Enterprise-grade data protection
- **Reference:** [arc.network](https://www.arc.network/)

### 4.4 EVM Compatibility
- **Full Compatibility:** Use existing Ethereum tools
- **Smart Contracts:** Deploy Solidity contracts directly
- **Development Tools:** Foundry, Hardhat, Remix, etc.
- **Migration:** Easy migration from Ethereum/EVM chains
- **Developer Experience:** Familiar tooling and workflows

### 4.5 Circle Integration & Ecosystem
- **Services Integrated:**
  - Circle Mint (stablecoin minting)
  - CCTP V2 (Cross-Chain Transfer Protocol - now canonical)
  - Circle Gateway (fiat on/off-ramps)
  - Circle Console (developer dashboard)
- **Benefits:**
  - Secure access to liquidity
  - Cross-chain USDC transfers (17+ chains supported)
  - Integration with traditional fiat systems
  - Native USDC operations without wrapped tokens
- **CCTP V2 Features:**
  - Burn-and-mint model (only canonical USDC)
  - Post-transfer hooks for composability
  - Increased transaction limits ($10M per transfer)
  - Native integration on Arc

---

## 5. DEVELOPMENT RESOURCES

### 5.1 Official Documentation & Links
- **Main Docs:** [docs.arc.network](https://docs.arc.network/)
- **Arc Website:** [arc.network](https://www.arc.network/)
- **Arc Litepaper:** [arc.network/litepaper](https://www.arc.network/litepaper)
- **Get Started:** [docs.arc.network/arc/get-started](https://docs.arc.network/arc/get-started)
- **Deploy Guide:** [docs.arc.network/arc/tutorials/deploy-on-arc](https://docs.arc.network/arc/tutorials/deploy-on-arc)
- **Connect Guide:** [docs.arc.network/arc/references/connect-to-arc](https://docs.arc.network/arc/references/connect-to-arc)

### 5.2 Developer Platform Resources
- **Circle Developers:** [developers.circle.com](https://developers.circle.com/)
- **Circle Console:** [console.circle.com](https://console.circle.com/signin)
- **USDC Contract Addresses:** [developers.circle.com/stablecoins/usdc-contract-addresses](https://developers.circle.com/stablecoins/usdc-contract-addresses)
- **EURC Contract Addresses:** [developers.circle.com/stablecoins/eurc-contract-addresses](https://developers.circle.com/stablecoins/eurc-contract-addresses)

### 5.3 Development Tools & SDKs
- **Foundry:** Recommended for smart contract development - [getfoundry.sh](https://getfoundry.sh/)
- **Hardhat:** Alternative development framework - [hardhat.org](https://hardhat.org/)
- **MetaMask:** Wallet integration - [metamask.io](https://metamask.io/)
- **Remix:** Online IDE support - [remix.ethereum.org](https://remix.ethereum.org/)
- **ThirdWeb:** No-code deployment tools - [thirdweb.com/arc-testnet](https://thirdweb.com/arc-testnet)

### 5.4 Node Providers & Infrastructure
- **Reference:** [docs.arc.network/arc/tools/node-providers](https://docs.arc.network/arc/tools/node-providers)
- **RPC Endpoints:** Multiple providers available for reliability
- **Arc RPC:** https://rpc.testnet.arc.network

### 5.5 Block Explorers & Analytics
- **Primary Explorer:** [testnet.arcscan.app](https://testnet.arcscan.app)
- **Type:** Blockscout-based
- **Features:** View transactions, addresses, contracts, blocks, real-time metrics
- **Reference:** [docs.arc.network/arc/tools/block-explorers](https://docs.arc.network/arc/tools/block-explorers)

### 5.6 Data Indexers
- **Reference:** [docs.arc.network/arc/tools/data-indexers](https://docs.arc.network/arc/tools/data-indexers)
- **Purpose:** On-chain data analysis and indexing
- **Use Cases:** Analytics, portfolio tracking, transaction history

### 5.7 Account Abstraction
- **Reference:** [docs.arc.network/arc/tools/account-abstraction](https://docs.arc.network/arc/tools/account-abstraction)
- **Features:** Enhanced wallet functionality, batched transactions, sponsored gas

---

## 6. ECOSYSTEM & PARTNERSHIPS

### 6.1 ArcFlow Finance
- **URL:** [arcflow.finance](https://arcflow.finance)
- **Type:** Decentralized Exchange (DEX)
- **Role:** Liquidity hub for developers, communities, and institutions
- **Features:**
  - Supports reflective tokens
  - Trustless USDC operations
  - Bridge functionality via CCTP V2
  - Multi-chain liquidity pools
- **Bridge:** [app.arcflow.finance/bridge](https://app.arcflow.finance/bridge)

### 6.2 Major Ecosystem Partners (Updated May 2026)
- **a16z Crypto:** Early institutional investor
- **BlackRock:** Strategic investor and institutional partner
- **Apollo:** Investment and partnership
- **Intercontinental Exchange (ICE):** Financial infrastructure partner
- **Visa:** Payment rails integration
- **HSBC:** Banking and settlement partner
- **Goldman Sachs:** Capital markets integration
- **Amazon Web Services (AWS):** Infrastructure provider
- **Alchemy:** Infrastructure and API services
- **Chainlink:** Oracle services
- **MetaMask:** Wallet integration
- **Circle:** Primary ecosystem operator

### 6.3 Chain Integrations
Arc connects with 17+ blockchain networks via CCTP V2, including:
- Ethereum
- Solana
- Avalanche
- Polygon
- Base
- Arbitrum
- Optimism
- Stellar
- World Chain
- And more...

---

## 7. USE CASES & BUILDING OPPORTUNITIES

### 7.1 Onchain Credit with Offchain Trust
- Identity-based lending protocols using verifiable credentials
- Reputation-driven credit systems tied to cash flow/payment history
- SMB and consumer credit apps for underserved markets
- Institutional lending networks

### 7.2 Capital Markets Settlement
- Tokenized securities platforms with instant DvP (Delivery vs Payment)
- Collateral management systems for stablecoin-backed margin
- Tokenized funds and structured products
- Prediction markets trading real-time data
- Institutional-grade settlement infrastructure

### 7.3 Stablecoin FX & Treasury
- Perpetuals and derivatives exchanges on stablecoin pairs
- Swap APIs for programmatic stablecoin conversion
- Treasury tools for multi-currency rebalancing
- Cross-border payouts with stable pricing
- Institutional FX operations

### 7.4 Agentic Commerce & AI Integration
- AI-mediated marketplaces where agents transact
- Machine-to-machine payment networks for IoT
- Coordination systems for agent intents
- Autonomous trading and settlement
- Smart contract-based AI execution

### 7.5 Cross-border Payments & Remittances
- Remittance platforms for consumer transfers
- Payout systems for marketplaces and gig workers
- Global payroll solutions with instant settlement
- Trade finance platforms with tokenized invoices
- Institutional payment rails

### 7.6 Enterprise & Institutional Use Cases
- Multi-signature treasury management
- Compliance-ready payment infrastructure
- Auditable transaction history
- Real-time settlement for B2B operations

---

## 8. CORE PRINCIPLES

### 8.1 Purpose-Built, Not General-Purpose
- Focus on real-world economic activity
- Global finance, internet commerce, institutional-grade DeFi
- Designed for predictability and compliance

### 8.2 Open and Composable by Default
- Public network, open to all developers
- Enterprise-ready but accessible
- Anyone can build, transact, integrate, contribute

### 8.3 Market-Neutral and Multichain-Aligned
- Interoperable via Circle CCTP V2 and Gateway
- Unlocks new use cases and partners
- Institutional liquidity onchain
- Bridge-first architecture

### 8.4 Built to Coordinate, Not Control
- Aligns builders and partners
- Exchanges, market makers, asset issuers
- Fintechs, banks, PSPs, enterprises
- Community-driven governance roadmap

### 8.5 Trusted Infrastructure, End-to-End
- Built on Malachite for certainty and reliability
- Long-term operational excellence
- Enterprise-grade infrastructure
- Institutional compliance standards

---

## 9. ROADMAP & TIMELINE (Updated May 2026)

### 9.1 Development Timeline
- **August 2025:** Private testnet phase announced
- **October 28, 2025:** Public testnet launch ✅ Completed
- **May 2026:** $222M Series A funding, whitepaper released ✅ Completed
- **Summer 2026:** Mainnet Beta launch (Target)
- **2026-2028:** Phased quantum-resistant upgrades

### 9.2 Current Phase: Public Testnet (Active)
- **Status:** Fully operational and stable
- **Uptime:** Continuous with scheduled maintenance
- **Transaction Count:** 244.1M+ as of May 2026
- **Purpose:** Testing, security hardening, ecosystem development
- **Access:** Open to all developers and companies
- **Bug Bounty:** Active program with rewards

### 9.3 Upcoming Phases (2026)
- **Summer 2026:** Mainnet Beta Launch
  - Initial validator set deployment
  - Early institutional access
  - Gradual node rollout
  - Community participation begins
- **Q3-Q4 2026:** Mainnet Expansion
  - Full network decentralization
  - Enhanced ecosystem tools
  - Institutional partner onboarding
  - Expanded payment capabilities
- **2026-2028:** Post-Mainnet Evolution
  - Enhanced tokenization features
  - Privacy feature rollout
  - Quantum-resistant upgrades (phased)
  - Governance transition to community

---

## 10. TOKENOMICS & GOVERNANCE (New - May 2026)

### 10.1 ARC Token Supply
- **Total Supply:** 10 billion ARC tokens
- **Allocation:**
  - 60% Ecosystem Growth (development, partnerships, incentives)
  - 25% Circle Reserves (validator infrastructure, staking, operations)
  - 15% Long-term Holdings (future growth and contingencies)

### 10.2 Token Use Cases
- **Governance:** Community voting on network upgrades and policies
- **Validator Staking:** Proof-of-Stake participation (post-mainnet)
- **Gas Fees:** Secondary option alongside USDC
- **Incentives:** Rewards for ecosystem participation

### 10.3 Governance Roadmap
- **Mainnet Launch (Summer 2026):** Token distribution begins
- **Q4 2026:** Initial governance framework
- **2027:** Progressive decentralization
- **2028:** Target transition to full community-driven PoS

---

## 11. SECURITY & COMPLIANCE

### 11.1 Validator Security
- **Model:** Permissioned validators at launch
- **Purpose:** Security and regulatory compliance
- **Access:** Open for users/developers (full network access)
- **Roadmap:** Gradual decentralization post-mainnet

### 11.2 Privacy Features
- **Type:** Opt-in configurable privacy (roadmap for mainnet)
- **Compliance:** Maintains auditability for regulators
- **Use Case:** Protect sensitive financial data
- **Status:** Technical design phase, deployment TBD

### 11.3 Quantum-Resistant Roadmap
- **Phase 1 (2026):** Wallet infrastructure upgrades
- **Phase 2 (2027):** Transaction privacy protections
- **Phase 3 (2027-2028):** Validator infrastructure migration
- **Flexibility:** Institutions can migrate at own pace

### 11.4 Compliance Tools
- **Reference:** [docs.arc.network/arc/tools/compliance](https://docs.arc.network/arc/tools/compliance)
- **Features:** Audit trails, regulatory reporting, identity verification
- **Standards:** GDPR, SOC 2, institutional finance compliance

### 11.5 Risk Management
- **USDC Stability:** USDC is 100% reserved with US dollar backing
- **Bridge Security:** CCTP V2 uses battle-tested burn-and-mint model
- **Insurance:** Coverage discussions with leading providers
- **Transparency:** Regular security audits and reports

---

## 12. CROSS-CHAIN CAPABILITIES

### 12.1 Circle CCTP V2 (Updated - Now Canonical)
- **Status:** V2 is now the official version (V1 deprecated)
- **Deprecation Date:** V1 support ends July 31, 2026
- **Supported Chains:** 17+ blockchains including Ethereum, Solana, Avalanche, Stellar, World Chain
- **Features:**
  - Fast, near-instant cross-chain transfers
  - Post-transfer hooks for composability
  - Increased limits: $10M per transfer (up from $1M)
  - Permissionless integration
- **Model:** Burn-and-mint (only canonical USDC, no wrapping)
- **Developer Tools:** Bridge Kit enables integration in <10 lines of code
- **Reference:** [Circle CCTP Documentation](https://developers.circle.com/docs/cctp-protocol)

### 12.2 Circle Gateway
- **Purpose:** Connect Arc with traditional fiat systems
- **Features:** On-ramp/off-ramp capabilities
- **Integration:** Seamless fiat-to-USDC and vice versa
- **Use Cases:** Institutional deposits, withdrawal processing

### 12.3 Official USDC Bridge
- **Launch:** April 2026
- **URL:** [bridge.usdc.com](https://bridge.usdc.com)
- **Volume (First Day):** $600M+ transactions
- **Users:** Institutional and retail access
- **Chains:** 17+ integrated networks

---

## 13. SOCIAL MEDIA & COMMUNITY CHANNELS

### 13.1 Official Channels
- **Twitter/X (Arc):** [@arc](https://x.com/arc)
- **Twitter/X (Circle):** [@circle](https://x.com/circle)
- **Website:** [arc.network](https://www.arc.network/)
- **Blog:** [arc.network/blog](https://www.arc.network/blog)
- **Community Forum:** [community.arc.io](https://community.arc.io/public/blogs/)

### 13.2 Developer Resources
- **Discord:** Circle and Arc community servers (official links TBD)
- **GitHub:** Arc Network repositories (open source development)
- **Reddit:** r/arcnetwork (community discussions)

### 13.3 Key Announcements & Updates (May 2026)
- **$222M Series A Funding:** [Circle raises $222M at $3B FDV](https://www.circle.com/blog)
- **Whitepaper Release:** Official Arc blockchain specification
- **Mainnet Timeline:** Summer 2026 launch confirmed

---

## 14. TECHNICAL REFERENCES

### 14.1 Contract Addresses
- **Reference:** [docs.arc.network/arc/references/contract-addresses](https://docs.arc.network/arc/references/contract-addresses)
- **Testnet USDC Address:** Available in documentation
- **Bridge Contracts:** CCTP V2 contract addresses

### 14.2 Gas and Fees
- **Reference:** [docs.arc.network/arc/references/gas-and-fees](https://docs.arc.network/arc/references/gas-and-fees)
- **Base Fee:** 160 Gwei minimum (stable USDC pricing)
- **Testnet Cost:** ~$0.01 per transaction
- **Mainnet Pricing:** To be announced closer to launch

### 14.3 System Overview
- **Reference:** [docs.arc.network/arc/concepts/system-overview](https://docs.arc.network/arc/concepts/system-overview)
- **Architecture:** Full documentation available
- **Performance Specs:** Sub-500ms finality, high throughput

### 14.4 Network Performance Metrics (May 2026)
- **Total Testnet Transactions:** 244.1M+
- **Average Block Time:** ~500ms
- **Finality:** Deterministic (0 reorganization risk)
- **Network Uptime:** 99.9%+ continuous operation

---

## 15. ARTICLES & ANALYSIS

### 15.1 Official Circle/Arc Publications
- **Circle Product Vision 2026:** [circle.com/blog/building-the-internet-financial-system-circles-product-vision-for-2026](https://www.circle.com/blog/building-the-internet-financial-system-circles-product-vision-for-2026)
- **Arc Blockchain Whitepaper:** Released May 2026
- **CCTP V2 Documentation:** Updated with latest features

### 15.2 Technical Analysis (2025-2026)
- **"Dollars That Move Like Messages"** - IOSG Ventures
- **"Arc Blockchain by Circle - An Overview"** - Coinmonks
- **"Arc: Circle's Answer to Stablecoin Infrastructure"** - High Tower

### 15.3 Institutional Insights
- **"Circle's Product Vision for 2026"** - Circle Blog
- **"Stablecoin Regulation & CLARITY Act"** - Multiple sources
- **"Post-Quantum Cryptography in Blockchain"** - Technical discussions

---

## 16. USDC & CIRCLE ECOSYSTEM UPDATES (May 2026)

### 16.1 USDC Current Status
- **Market Position:** World's most compliant stablecoin
- **Supply:** $77 billion (as of May 2026)
- **Transaction Volume (Q1 2026):** $21.5 trillion
- **Weekly Mint Record:** $3.25 billion (single week on Solana, May 2026)

### 16.2 CCTP V2 Expansion
- **Status:** Canonical version, V1 deprecated
- **V1 Sunset Date:** July 31, 2026
- **New Chains:** Stellar, World Chain added in Q2 2026
- **Transaction Limit:** Increased to $10M per transfer

### 16.3 Regulatory Environment
- **CLARITY Act Status:** Compromise passed (May 2026)
- **Stablecoin Yield:** Activity-based rewards preserved (not banned)
- **Compliance:** Enhanced regulatory clarity expected H2 2026

### 16.4 Circle Initiatives
- **Arc Mainnet:** Summer 2026 target
- **Series A Funding:** $222M closed (May 2026)
- **Investor Base:** a16z Crypto, BlackRock, Apollo, ICE, and others
- **Company Valuation:** $3B FDV

---

## 17. KEY DIFFERENTIATORS (2026 Edition)

1. **Stablecoin Native Gas:** USDC as native gas - only major chain (no volatility)
2. **Deterministic Finality:** Sub-second, Byzantine Fault Tolerant consensus
3. **Circle Integration:** Native access to USDC, CCTP V2, and Gateway
4. **Economic Focus:** Purpose-built for real-world economic activity
5. **Enterprise Ready:** Institutional-grade infrastructure and compliance
6. **Privacy Options:** Roadmap for configurable privacy with compliance
7. **Quantum Resistant:** Post-quantum cryptography phased rollout (2026-2028)
8. **Major Partnerships:** BlackRock, Visa, HSBC, Goldman Sachs, AWS backing
9. **Institutional Funding:** $222M Series A from top-tier investors
10. **Developer Experience:** Familiar EVM tooling + powerful new capabilities

---

## 18. NOTES & OBSERVATIONS (Updated May 2026)

- Arc is positioned as Circle's institutional-grade answer to blockchain scalability
- Strong emphasis on real-world use cases (payments, settlement, capital markets)
- Institutional partnerships validate market demand for stablecoin-native blockchain
- Regulatory clarity (CLARITY Act compromise) strengthens stablecoin ecosystem
- Quantum-resistant roadmap shows long-term thinking on network security
- Testnet metrics (244M+ transactions) demonstrate network reliability
- $222M Series A signals strong institutional confidence in mainnet launch
- Community engagement and open-source approach builds developer confidence
- Post-mainnet governance transition signals commitment to decentralization

---

## 19. RESOURCES - QUICK LINKS (Updated)

### 19.1 Official Resources
- **Website:** [arc.network](https://www.arc.network/)
- **Documentation:** [docs.arc.network](https://docs.arc.network/)
- **Litepaper:** [arc.network/litepaper](https://www.arc.network/litepaper)
- **ArcFlow Finance:** [arcflow.finance](https://arcflow.finance)
- **Testnet Explorer:** [testnet.arcscan.app](https://testnet.arcscan.app)
- **Faucet:** [faucet.circle.com](https://faucet.circle.com)
- **USDC Bridge:** [bridge.usdc.com](https://bridge.usdc.com)

### 19.2 Circle Developer Resources
- **Circle Developers:** [developers.circle.com](https://developers.circle.com/)
- **Circle Console:** [console.circle.com](https://console.circle.com/signin)
- **USDC Addresses:** [developers.circle.com/stablecoins/usdc-contract-addresses](https://developers.circle.com/stablecoins/usdc-contract-addresses)
- **EURC Addresses:** [developers.circle.com/stablecoins/eurc-contract-addresses](https://developers.circle.com/stablecoins/eurc-contract-addresses)

### 19.3 Social Media
- **Twitter (Arc):** [@arc](https://x.com/arc)
- **Twitter (Circle):** [@circle](https://x.com/circle)
- **Community Forum:** [community.arc.io](https://community.arc.io/public/blogs/)

### 19.4 Development
- **RPC (Testnet):** https://rpc.testnet.arc.network
- **Chain ID:** 5042002
- **GitHub:** Arc Network repositories (open source)
- **ThirdWeb SDK:** [thirdweb.com/arc-testnet](https://thirdweb.com/arc-testnet)

### 19.5 Tools & Infrastructure
- **Foundry:** [getfoundry.sh](https://getfoundry.sh/)
- **Hardhat:** [hardhat.org](https://hardhat.org/)
- **MetaMask:** [metamask.io](https://metamask.io/)
- **Remix IDE:** [remix.ethereum.org](https://remix.ethereum.org/)

---

## 20. NEXT STEPS FOR DEVELOPERS (Updated 2026)

### Immediate Actions
1. **Connect to Testnet:** Set up wallet and get testnet USDC
2. **Explore Documentation:** Review deployment guides at docs.arc.network
3. **Deploy Test Contract:** Use Foundry to deploy first contract
4. **Join Communities:** Follow @arc and @circle on X/Twitter

### Development Activities
5. **Build Meaningful dApps:** Focus on real-world use cases
6. **Test CCTP V2:** Migrate from V1 before July 31, 2026 deadline
7. **Explore Integrations:** Try ArcFlow Finance and USDC Bridge
8. **Monitor Updates:** Watch for mainnet launch announcements (Summer 2026)

### Community Engagement
9. **Participate in Testing:** Help identify issues and improvements
10. **Share Feedback:** Contribute to ecosystem development
11. **Build Network:** Connect with other developers and builders
12. **Prepare for Mainnet:** Get ready for production deployment

---

## 21. FAQ & QUICK ANSWERS

**Q: When is Arc Mainnet launching?**  
A: Summer 2026 (official target as of May 2026 announcement)

**Q: Should I migrate from CCTP V1 to V2?**  
A: Yes, V1 support ends July 31, 2026. Migrate immediately using new Bridge Kit.

**Q: Is Arc production-ready?**  
A: Testnet is stable and fully operational. Mainnet will be production-ready at launch.

**Q: What is the minimum gas fee?**  
A: ~$0.01 per transaction on testnet (stable USDC pricing, no volatility)

**Q: Can I use familiar Ethereum tools?**  
A: Yes! Arc is EVM-compatible. Use Foundry, Hardhat, Remix, MetaMask, etc.

**Q: Is there a bug bounty program?**  
A: Yes, active bug bounty for testnet participation.

**Q: How do I get testnet USDC?**  
A: Visit https://faucet.circle.com

---

**Document Status:** Updated & Complete  
**Last Updated:** 2026-05-20  
**Next Review:** Q3 2026 (post-mainnet launch)  
**Data Sources:** Official Circle/Arc documentation, May 2026 announcements, web searches, community resources, developer feedback

---

## CHANGE LOG

**Version 2.0 - May 2026 Update**
- Added May 2026 Series A funding details ($222M, $3B FDV)
- Updated testnet metrics (244.1M+ transactions)
- Added CCTP V2 as canonical version (V1 deprecation notice)
- Added ARC token tokenomics (10B supply, 60/25/15 allocation)
- Added quantum-resistant roadmap details
- Updated partnership list (BlackRock, Apollo, ICE, etc.)
- Added USDC Bridge information (April 2026 launch)
- Updated CLARITY Act regulatory status
- Added mainnet summer 2026 timeline confirmation
- Expanded institutional use cases
- Added comprehensive governance roadmap
