/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-iotashimmer/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class IOTAShimmer implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'IOTA/Shimmer',
    name: 'iotashimmer',
    icon: 'file:iotashimmer.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the IOTA/Shimmer API',
    defaults: {
      name: 'IOTA/Shimmer',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'iotashimmerApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Block',
            value: 'block',
          },
          {
            name: 'Output',
            value: 'output',
          },
          {
            name: 'Transaction',
            value: 'transaction',
          },
          {
            name: 'Address',
            value: 'address',
          },
          {
            name: 'Milestone',
            value: 'milestone',
          },
          {
            name: 'NativeToken',
            value: 'nativeToken',
          },
          {
            name: 'NodeInfo',
            value: 'nodeInfo',
          }
        ],
        default: 'block',
      },
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['block'] } },
  options: [
    { name: 'Get Block', value: 'getBlock', description: 'Retrieve a block by its ID', action: 'Get a block' },
    { name: 'Create Block', value: 'createBlock', description: 'Submit a new block to the network', action: 'Create a block' },
    { name: 'Get Block Metadata', value: 'getBlockMetadata', description: 'Get metadata for a specific block', action: 'Get block metadata' },
    { name: 'Get Blocks', value: 'getBlocks', description: 'List recent blocks', action: 'Get blocks' },
  ],
  default: 'getBlock',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['output'] } },
	options: [
		{ name: 'Get Output', value: 'getOutput', description: 'Retrieve an output by its ID', action: 'Get output' },
		{ name: 'Get Output Metadata', value: 'getOutputMetadata', description: 'Get metadata for a specific output', action: 'Get output metadata' },
		{ name: 'Query Outputs', value: 'queryOutputs', description: 'Query outputs by various criteria', action: 'Query outputs' },
		{ name: 'Get Address Outputs', value: 'getAddressOutputs', description: 'Get all outputs for an address', action: 'Get address outputs' },
	],
	default: 'getOutput',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
		},
	},
	options: [
		{
			name: 'Get Transaction',
			value: 'getTransaction',
			description: 'Retrieve a transaction by its ID',
			action: 'Get a transaction',
		},
		{
			name: 'Submit Transaction',
			value: 'submitTransaction',
			description: 'Submit a transaction to the network',
			action: 'Submit a transaction',
		},
		{
			name: 'Get Transaction Included Block',
			value: 'getTransactionIncludedBlock',
			description: 'Get the block that includes a transaction',
			action: 'Get transaction included block',
		},
	],
	default: 'getTransaction',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['address'],
		},
	},
	options: [
		{
			name: 'Get Address Info',
			value: 'getAddressInfo',
			description: 'Get information about an address',
			action: 'Get address info',
		},
		{
			name: 'Get Address Balance',
			value: 'getAddressBalance',
			description: 'Get the balance of an address',
			action: 'Get address balance',
		},
		{
			name: 'Get Address Outputs',
			value: 'getAddressOutputs',
			description: 'Get outputs associated with an address',
			action: 'Get address outputs',
		},
	],
	default: 'getAddressInfo',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['milestone'],
		},
	},
	options: [
		{
			name: 'Get Milestone',
			value: 'getMilestone',
			description: 'Retrieve a milestone by its ID',
			action: 'Get a milestone',
		},
		{
			name: 'Get Milestone by Index',
			value: 'getMilestoneByIndex',
			description: 'Get a milestone by its index',
			action: 'Get milestone by index',
		},
		{
			name: 'Get Latest Milestone',
			value: 'getLatestMilestone',
			description: 'Get the latest confirmed milestone',
			action: 'Get latest milestone',
		},
	],
	default: 'getMilestone',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['nativeToken'],
    },
  },
  options: [
    {
      name: 'Get Token Info',
      value: 'getTokenInfo',
      description: 'Get information about a native token',
      action: 'Get token info',
    },
    {
      name: 'Query Tokens',
      value: 'queryTokens',
      description: 'Query tokens by various criteria',
      action: 'Query tokens',
    },
    {
      name: 'Get Foundry',
      value: 'getFoundry',
      description: 'Get foundry information',
      action: 'Get foundry',
    },
  ],
  default: 'getTokenInfo',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: {
    show: {
      resource: ['nodeInfo'],
    },
  },
  options: [
    {
      name: 'Get Node Info',
      value: 'getNodeInfo',
      description: 'Get general node information',
      action: 'Get node info',
    },
    {
      name: 'Get Protocol Parameters',
      value: 'getProtocolParameters',
      description: 'Get current protocol parameters',
      action: 'Get protocol parameters',
    },
    {
      name: 'Get Node Health',
      value: 'getNodeHealth',
      description: 'Check node health status',
      action: 'Get node health',
    },
  ],
  default: 'getNodeInfo',
},
{
  displayName: 'Block ID',
  name: 'blockId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['block'], operation: ['getBlock'] } },
  default: '',
  description: 'The 64-character hex string ID of the block to retrieve',
},
{
  displayName: 'Block Data',
  name: 'blockData',
  type: 'json',
  required: true,
  displayOptions: { show: { resource: ['block'], operation: ['createBlock'] } },
  default: '{}',
  description: 'The block data to submit to the network',
},
{
  displayName: 'Block ID',
  name: 'blockId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['block'], operation: ['getBlockMetadata'] } },
  default: '',
  description: 'The 64-character hex string ID of the block to get metadata for',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  displayOptions: { show: { resource: ['block'], operation: ['getBlocks'] } },
  default: 10,
  description: 'Maximum number of blocks to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  displayOptions: { show: { resource: ['block'], operation: ['getBlocks'] } },
  default: 0,
  description: 'Number of blocks to skip',
},
{
	displayName: 'Output ID',
	name: 'outputId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['output'], operation: ['getOutput'] } },
	default: '',
	description: 'The ID of the output to retrieve (64-character hex string)',
},
{
	displayName: 'Output ID',
	name: 'outputId',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['output'], operation: ['getOutputMetadata'] } },
	default: '',
	description: 'The ID of the output to get metadata for (64-character hex string)',
},
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	displayOptions: { show: { resource: ['output'], operation: ['queryOutputs'] } },
	default: '',
	description: 'Filter outputs by bech32 address',
},
{
	displayName: 'Has Native Tokens',
	name: 'hasNativeTokens',
	type: 'boolean',
	displayOptions: { show: { resource: ['output'], operation: ['queryOutputs'] } },
	default: false,
	description: 'Filter outputs that have native tokens',
},
{
	displayName: 'Minimum Amount',
	name: 'minAmount',
	type: 'number',
	displayOptions: { show: { resource: ['output'], operation: ['queryOutputs'] } },
	default: 0,
	description: 'Minimum amount of base tokens',
},
{
	displayName: 'Maximum Amount',
	name: 'maxAmount',
	type: 'number',
	displayOptions: { show: { resource: ['output'], operation: ['queryOutputs'] } },
	default: 0,
	description: 'Maximum amount of base tokens',
},
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: { show: { resource: ['output'], operation: ['getAddressOutputs'] } },
	default: '',
	description: 'The bech32 address to get outputs for',
},
{
	displayName: 'Include Spent',
	name: 'includeSpent',
	type: 'boolean',
	displayOptions: { show: { resource: ['output'], operation: ['getAddressOutputs'] } },
	default: false,
	description: 'Include spent outputs in the results',
},
{
	displayName: 'Transaction ID',
	name: 'transactionId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransaction', 'getTransactionIncludedBlock'],
		},
	},
	default: '',
	placeholder: '0x1234567890abcdef...',
	description: 'The transaction ID as a 64-character hex string',
},
{
	displayName: 'Transaction Data',
	name: 'transactionData',
	type: 'json',
	required: true,
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['submitTransaction'],
		},
	},
	default: '{}',
	description: 'The transaction data in JSON format with hex encoding',
	placeholder: '{"essence": {"type": 1, "inputs": [...], "outputs": [...]}, "unlocks": [...]}',
},
{
	displayName: 'Network Type',
	name: 'networkType',
	type: 'options',
	options: [
		{
			name: 'IOTA Mainnet',
			value: 'iota',
		},
		{
			name: 'Shimmer',
			value: 'shimmer',
		},
	],
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransaction', 'submitTransaction', 'getTransactionIncludedBlock'],
		},
	},
	default: 'iota',
	description: 'The network to use for the transaction operation',
},
{
	displayName: 'Include Metadata',
	name: 'includeMetadata',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['transaction'],
			operation: ['getTransaction'],
		},
	},
	default: false,
	description: 'Whether to include additional metadata in the response',
},
{
	displayName: 'Address',
	name: 'address',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['address'],
			operation: ['getAddressInfo', 'getAddressBalance', 'getAddressOutputs'],
		},
	},
	default: '',
	description: 'The bech32-encoded address to query',
},
{
	displayName: 'Include Spent',
	name: 'includeSpent',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['address'],
			operation: ['getAddressOutputs'],
		},
	},
	default: false,
	description: 'Whether to include spent outputs in the response',
},
{
	displayName: 'Milestone ID',
	name: 'milestoneId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['milestone'],
			operation: ['getMilestone'],
		},
	},
	default: '',
	description: 'The milestone ID (64-character hex string)',
	placeholder: 'e.g. 0x1234567890abcdef...',
},
{
	displayName: 'Index',
	name: 'index',
	type: 'number',
	required: true,
	displayOptions: {
		show: {
			resource: ['milestone'],
			operation: ['getMilestoneByIndex'],
		},
	},
	default: 0,
	description: 'The milestone index number',
},
{
  displayName: 'Token ID',
  name: 'tokenId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nativeToken'],
      operation: ['getTokenInfo'],
    },
  },
  default: '',
  description: 'The ID of the token to retrieve information for (64-character hex string)',
},
{
  displayName: 'Foundry ID',
  name: 'foundryId',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['nativeToken'],
      operation: ['queryTokens'],
    },
  },
  default: '',
  description: 'Filter tokens by foundry ID (64-character hex string)',
},
{
  displayName: 'Alias Address',
  name: 'aliasAddress',
  type: 'string',
  displayOptions: {
    show: {
      resource: ['nativeToken'],
      operation: ['queryTokens'],
    },
  },
  default: '',
  description: 'Filter tokens by alias address (bech32 format)',
},
{
  displayName: 'Foundry ID',
  name: 'foundryId',
  type: 'string',
  required: true,
  displayOptions: {
    show: {
      resource: ['nativeToken'],
      operation: ['getFoundry'],
    },
  },
  default: '',
  description: 'The ID of the foundry to retrieve information for (64-character hex string)',
},
{
  displayName: 'Additional Options',
  name: 'additionalOptions',
  type: 'collection',
  placeholder: 'Add Option',
  displayOptions: {
    show: {
      resource: ['nodeInfo'],
      operation: ['getNodeInfo', 'getProtocolParameters', 'getNodeHealth'],
    },
  },
  default: {},
  options: [
    {
      displayName: 'Include Raw Response',
      name: 'includeRawResponse',
      type: 'boolean',
      default: false,
      description: 'Whether to include the raw API response in the output',
    },
  ],
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'block':
        return [await executeBlockOperations.call(this, items)];
      case 'output':
        return [await executeOutputOperations.call(this, items)];
      case 'transaction':
        return [await executeTransactionOperations.call(this, items)];
      case 'address':
        return [await executeAddressOperations.call(this, items)];
      case 'milestone':
        return [await executeMilestoneOperations.call(this, items)];
      case 'nativeToken':
        return [await executeNativeTokenOperations.call(this, items)];
      case 'nodeInfo':
        return [await executeNodeInfoOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeBlockOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('iotashimmerApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getBlock': {
          const blockId = this.getNodeParameter('blockId', i) as string;
          
          if (!/^[a-fA-F0-9]{64}$/.test(blockId)) {
            throw new NodeOperationError(this.getNode(), 'Block ID must be a 64-character hex string');
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/core/v2/blocks/${blockId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createBlock': {
          const blockData = this.getNodeParameter('blockData', i) as any;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/v2/blocks`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: blockData,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlockMetadata': {
          const blockId = this.getNodeParameter('blockId', i) as string;
          
          if (!/^[a-fA-F0-9]{64}$/.test(blockId)) {
            throw new NodeOperationError(this.getNode(), 'Block ID must be a 64-character hex string');
          }

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/core/v2/blocks/${blockId}/metadata`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getBlocks': {
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          
          const queryParams = new URLSearchParams();
          if (limit) queryParams.append('limit', limit.toString());
          if (offset) queryParams.append('offset', offset.toString());
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/core/v2/blocks?${queryParams.toString()}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeOutputOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('iotashimmerApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getOutput': {
					const outputId = this.getNodeParameter('outputId', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/api/core/v2/outputs/${outputId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getOutputMetadata': {
					const outputId = this.getNodeParameter('outputId', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/api/core/v2/outputs/${outputId}/metadata`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'queryOutputs': {
					const queryParams: any = {};
					const address = this.getNodeParameter('address', i) as string;
					const hasNativeTokens = this.getNodeParameter('hasNativeTokens', i) as boolean;
					const minAmount = this.getNodeParameter('minAmount', i) as number;
					const maxAmount = this.getNodeParameter('maxAmount', i) as number;

					if (address) queryParams.address = address;
					if (hasNativeTokens) queryParams.hasNativeTokens = hasNativeTokens;
					if (minAmount > 0) queryParams.minAmount = minAmount;
					if (maxAmount > 0) queryParams.maxAmount = maxAmount;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/api/core/v2/outputs/query`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: queryParams,
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAddressOutputs': {
					const address = this.getNodeParameter('address', i) as string;
					const includeSpent = this.getNodeParameter('includeSpent', i) as boolean;
					
					let url = `${credentials.baseUrl}/api/core/v2/addresses/${address}/outputs`;
					if (includeSpent) {
						url += '?includeSpent=true';
					}

					const options: any = {
						method: 'GET',
						url: url,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({ json: result, pairedItem: { item: i } });
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeTransactionOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('iotashimmerApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;
			const networkType = this.getNodeParameter('networkType', i) as string;
			const baseUrl = networkType === 'shimmer' ? 'https://api.shimmer.network' : credentials.baseUrl || 'https://api.stardust-mainnet.iotaledger.net';

			switch (operation) {
				case 'getTransaction': {
					const transactionId = this.getNodeParameter('transactionId', i) as string;
					const includeMetadata = this.getNodeParameter('includeMetadata', i) as boolean;

					// Validate transaction ID format (64-character hex string)
					if (!/^0x[a-fA-F0-9]{64}$/.test(transactionId) && !/^[a-fA-F0-9]{64}$/.test(transactionId)) {
						throw new NodeOperationError(this.getNode(), `Invalid transaction ID format. Must be a 64-character hex string: ${transactionId}`);
					}

					const cleanTransactionId = transactionId.startsWith('0x') ? transactionId.slice(2) : transactionId;
					let url = `${baseUrl}/api/core/v2/transactions/${cleanTransactionId}`;
					
					if (includeMetadata) {
						url += '?include-metadata=true';
					}

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'submitTransaction': {
					const transactionData = this.getNodeParameter('transactionData', i) as object;

					const options: any = {
						method: 'POST',
						url: `${baseUrl}/api/core/v2/transactions`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: transactionData,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getTransactionIncludedBlock': {
					const transactionId = this.getNodeParameter('transactionId', i) as string;

					// Validate transaction ID format (64-character hex string)
					if (!/^0x[a-fA-F0-9]{64}$/.test(transactionId) && !/^[a-fA-F0-9]{64}$/.test(transactionId)) {
						throw new NodeOperationError(this.getNode(), `Invalid transaction ID format. Must be a 64-character hex string: ${transactionId}`);
					}

					const cleanTransactionId = transactionId.startsWith('0x') ? transactionId.slice(2) : transactionId;

					const options: any = {
						method: 'GET',
						url: `${baseUrl}/api/core/v2/transactions/${cleanTransactionId}/included-block`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeAddressOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('iotashimmerApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAddressInfo': {
					const address = this.getNodeParameter('address', i) as string;
					
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/api/core/v2/addresses/${address}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAddressBalance': {
					const address = this.getNodeParameter('address', i) as string;
					
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/api/core/v2/addresses/${address}/balance`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getAddressOutputs': {
					const address = this.getNodeParameter('address', i) as string;
					const includeSpent = this.getNodeParameter('includeSpent', i) as boolean;
					
					const queryParams = new URLSearchParams();
					if (includeSpent) {
						queryParams.append('includeSpent', 'true');
					}
					
					const url = `${credentials.baseUrl}/api/core/v2/addresses/${address}/outputs`;
					const fullUrl = queryParams.toString() ? `${url}?${queryParams.toString()}` : url;
					
					const options: any = {
						method: 'GET',
						url: fullUrl,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeMilestoneOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('iotashimmerApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getMilestone': {
					const milestoneId = this.getNodeParameter('milestoneId', i) as string;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/api/core/v2/milestones/${milestoneId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getMilestoneByIndex': {
					const index = this.getNodeParameter('index', i) as number;
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/api/core/v2/milestones/by-index/${index}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getLatestMilestone': {
					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/api/core/v2/milestones/latest`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};
					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeNativeTokenOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('iotashimmerApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'getTokenInfo': {
          const tokenId = this.getNodeParameter('tokenId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/core/v2/tokens/${tokenId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'queryTokens': {
          const foundryId = this.getNodeParameter('foundryId', i) as string;
          const aliasAddress = this.getNodeParameter('aliasAddress', i) as string;
          
          const queryParams: any = {};
          if (foundryId) queryParams.foundryId = foundryId;
          if (aliasAddress) queryParams.aliasAddress = aliasAddress;
          
          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/api/core/v2/tokens/query`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body: queryParams,
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getFoundry': {
          const foundryId = this.getNodeParameter('foundryId', i) as string;
          
          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/api/core/v2/foundries/${foundryId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(
            this.getNode(),
            `Unknown operation: ${operation}`,
          );
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeNodeInfoOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('iotashimmerApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const additionalOptions = this.getNodeParameter('additionalOptions', i, {}) as any;
      
      const baseOptions: any = {
        headers: {
          'Content-Type': 'application/json',
        },
        json: true,
      };

      if (credentials.apiKey) {
        baseOptions.headers['Authorization'] = `Bearer ${credentials.apiKey}`;
      }

      switch (operation) {
        case 'getNodeInfo': {
          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${credentials.baseUrl}/api/core/v2/info`,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          
          if (additionalOptions.includeRawResponse) {
            result = {
              data: result,
              rawResponse: result,
            };
          }
          break;
        }

        case 'getProtocolParameters': {
          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${credentials.baseUrl}/api/core/v2/info/protocol-parameters`,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          
          if (additionalOptions.includeRawResponse) {
            result = {
              data: result,
              rawResponse: result,
            };
          }
          break;
        }

        case 'getNodeHealth': {
          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${credentials.baseUrl}/health`,
          };
          
          result = await this.helpers.httpRequest(options) as any;
          
          if (additionalOptions.includeRawResponse) {
            result = {
              data: result,
              rawResponse: result,
            };
          }
          break;
        }

        default:
          throw new NodeOperationError(
            this.getNode(),
            `Unknown operation: ${operation}`,
            { itemIndex: i }
          );
      }

      returnData.push({
        json: result,
        pairedItem: { item: i },
      });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i },
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}
