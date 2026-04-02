# n8n-nodes-iota-shimmer

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for interacting with IOTA and Shimmer networks. This node provides access to 7 essential resources including blocks, outputs, transactions, addresses, milestones, native tokens, and node information, enabling seamless integration of IOTA/Shimmer blockchain operations into your automation workflows.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![IOTA](https://img.shields.io/badge/IOTA-Mainnet-29334C)
![Shimmer](https://img.shields.io/badge/Shimmer-Network-4DC8FF)
![Tangle](https://img.shields.io/badge/Tangle-Enabled-00E5C1)

## Features

- **Multi-Network Support** - Connect to both IOTA mainnet and Shimmer networks
- **Complete Block Operations** - Query, retrieve, and analyze blocks with full metadata
- **Output Management** - Access and monitor UTXOs, including spent/unspent status
- **Transaction Tracking** - Retrieve transaction details, history, and confirmation status  
- **Address Analytics** - Get balance information, transaction history, and address validation
- **Milestone Monitoring** - Track network milestones and confirmation progress
- **Native Token Support** - Handle custom tokens on IOTA/Shimmer networks
- **Node Information** - Access real-time node status, health, and network statistics

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-iota-shimmer`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-iota-shimmer
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-iota-shimmer.git
cd n8n-nodes-iota-shimmer
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-iota-shimmer
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your IOTA/Shimmer node API key | Yes |
| Node URL | The base URL of your IOTA/Shimmer node | Yes |
| Network | Select IOTA Mainnet or Shimmer Network | Yes |

## Resources & Operations

### 1. Block

| Operation | Description |
|-----------|-------------|
| Get | Retrieve a specific block by ID |
| List | Get multiple blocks with filtering options |
| Get Metadata | Fetch block metadata including confirmation status |
| Get Children | Retrieve child blocks of a specific block |

### 2. Output

| Operation | Description |
|-----------|-------------|
| Get | Retrieve output details by output ID |
| List | Get outputs with filtering by address or other criteria |
| Get Metadata | Fetch output metadata including spent status |
| List Unspent | Retrieve only unspent outputs for an address |

### 3. Transaction

| Operation | Description |
|-----------|-------------|
| Get | Retrieve transaction details by transaction ID |
| List | Get transactions with filtering options |
| Get Included Block | Find the block that includes a specific transaction |
| Submit | Submit a new transaction to the network |

### 4. Address

| Operation | Description |
|-----------|-------------|
| Get Balance | Retrieve balance information for an address |
| Get Outputs | Get all outputs associated with an address |
| Validate | Validate address format and checksum |
| Generate | Generate new addresses using seed phrases |

### 5. Milestone

| Operation | Description |
|-----------|-------------|
| Get | Retrieve milestone details by index |
| Get Latest | Fetch the latest milestone information |
| Get UTC | Get milestone with UTC timestamp conversion |
| List | Retrieve multiple milestones within a range |

### 6. NativeToken

| Operation | Description |
|-----------|-------------|
| Get | Retrieve native token information by token ID |
| List | Get all native tokens with filtering options |
| Get Metadata | Fetch token metadata including supply and foundry |
| Get Foundry | Retrieve foundry information for a token |

### 7. NodeInfo

| Operation | Description |
|-----------|-------------|
| Get Info | Retrieve general node information and status |
| Get Health | Check node health and synchronization status |
| Get Metrics | Get detailed node performance metrics |
| Get Peers | Retrieve connected peer information |

## Usage Examples

```javascript
// Get block information
{
  "blockId": "0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef",
  "includeMetadata": true
}
```

```javascript
// Check address balance
{
  "address": "iota1qpszqzadsym6wpppd6z037dvlejmjuke7s24hm95s9fg9vpua7vluaw60xu",
  "includeOutputs": true
}
```

```javascript
// Get latest milestone
{
  "includeTimestamp": true,
  "formatUTC": true
}
```

```javascript
// Submit transaction
{
  "essence": {
    "type": 1,
    "inputs": [...],
    "outputs": [...],
    "payload": null
  },
  "unlockBlocks": [...]
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Invalid Block ID | Block ID format is incorrect | Ensure block ID is 64-character hex string with 0x prefix |
| Address Not Found | Specified address doesn't exist or has no activity | Verify address format and network selection |
| Node Unreachable | Cannot connect to IOTA/Shimmer node | Check node URL and network connectivity |
| API Key Invalid | Authentication failed with provided API key | Verify API key is correct and has proper permissions |
| Transaction Failed | Transaction submission was rejected | Check transaction format and sufficient balance |
| Milestone Not Found | Requested milestone index doesn't exist | Verify milestone index is within valid range |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-iota-shimmer/issues)
- **IOTA Documentation**: [IOTA Wiki](https://wiki.iota.org/)
- **Shimmer Documentation**: [Shimmer Network Docs](https://shimmer.network/)