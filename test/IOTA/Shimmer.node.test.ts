/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { IOTAShimmer } from '../nodes/IOTA/Shimmer/IOTA/Shimmer.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('IOTAShimmer Node', () => {
  let node: IOTAShimmer;

  beforeAll(() => {
    node = new IOTAShimmer();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('IOTA/Shimmer');
      expect(node.description.name).toBe('iotashimmer');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 7 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(7);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(7);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Block Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.stardust-mainnet.iotaledger.net'
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn()
      },
    };
  });

  describe('getBlock operation', () => {
    it('should successfully get a block', async () => {
      const mockBlockData = { blockId: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef', data: 'block data' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlock')
        .mockReturnValueOnce('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockBlockData);

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockBlockData, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.stardust-mainnet.iotaledger.net/api/core/v2/blocks/1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });

    it('should handle invalid block ID format', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlock')
        .mockReturnValueOnce('invalid-block-id');

      await expect(executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]))
        .rejects.toThrow('Block ID must be a 64-character hex string');
    });
  });

  describe('createBlock operation', () => {
    it('should successfully create a block', async () => {
      const mockBlockData = { block: 'data' };
      const mockResponse = { blockId: 'new-block-id' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('createBlock')
        .mockReturnValueOnce(mockBlockData);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.stardust-mainnet.iotaledger.net/api/core/v2/blocks',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        body: mockBlockData,
        json: true,
      });
    });
  });

  describe('getBlockMetadata operation', () => {
    it('should successfully get block metadata', async () => {
      const mockMetadata = { metadata: 'data' };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlockMetadata')
        .mockReturnValueOnce('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockMetadata);

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockMetadata, pairedItem: { item: 0 } }]);
    });
  });

  describe('getBlocks operation', () => {
    it('should successfully get blocks list', async () => {
      const mockBlocks = { blocks: ['block1', 'block2'] };
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlocks')
        .mockReturnValueOnce(10)
        .mockReturnValueOnce(0);
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockBlocks);

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockBlocks, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.stardust-mainnet.iotaledger.net/api/core/v2/blocks?limit=10&offset=0',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });
    });
  });

  describe('error handling', () => {
    it('should handle API errors with continueOnFail', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getBlock')
        .mockReturnValueOnce('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeBlockOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });
});

describe('Output Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({ 
				apiKey: 'test-key', 
				baseUrl: 'https://api.stardust-mainnet.iotaledger.net' 
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
		};
	});

	it('should get output successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'getOutput';
			if (param === 'outputId') return '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
		});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ data: 'output data' });

		const result = await executeOutputOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({ data: 'output data' });
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({
			method: 'GET',
			url: 'https://api.stardust-mainnet.iotaledger.net/api/core/v2/outputs/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
		}));
	});

	it('should get output metadata successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'getOutputMetadata';
			if (param === 'outputId') return '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
		});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ metadata: 'output metadata' });

		const result = await executeOutputOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({ metadata: 'output metadata' });
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({
			method: 'GET',
			url: 'https://api.stardust-mainnet.iotaledger.net/api/core/v2/outputs/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef/metadata',
		}));
	});

	it('should query outputs successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'queryOutputs';
			if (param === 'address') return 'iota1qpszqzadsym6wpppd6z037dvlejmjuke7s24hm95s9fg9vpua7vluaw60xu';
			if (param === 'hasNativeTokens') return true;
			if (param === 'minAmount') return 1000;
			if (param === 'maxAmount') return 5000;
		});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ outputs: [] });

		const result = await executeOutputOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({ outputs: [] });
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({
			method: 'POST',
			url: 'https://api.stardust-mainnet.iotaledger.net/api/core/v2/outputs/query',
			body: expect.objectContaining({
				address: 'iota1qpszqzadsym6wpppd6z037dvlejmjuke7s24hm95s9fg9vpua7vluaw60xu',
				hasNativeTokens: true,
				minAmount: 1000,
				maxAmount: 5000,
			}),
		}));
	});

	it('should get address outputs successfully', async () => {
		mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
			if (param === 'operation') return 'getAddressOutputs';
			if (param === 'address') return 'iota1qpszqzadsym6wpppd6z037dvlejmjuke7s24hm95s9fg9vpua7vluaw60xu';
			if (param === 'includeSpent') return false;
		});

		mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({ outputs: ['output1', 'output2'] });

		const result = await executeOutputOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({ outputs: ['output1', 'output2'] });
		expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(expect.objectContaining({
			method: 'GET',
			url: 'https://api.stardust-mainnet.iotaledger.net/api/core/v2/addresses/iota1qpszqzadsym6wpppd6z037dvlejmjuke7s24hm95s9fg9vpua7vluaw60xu/outputs',
		}));
	});

	it('should handle errors gracefully when continueOnFail is true', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getOutput');
		mockExecuteFunctions.continueOnFail.mockReturnValue(true);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		const result = await executeOutputOperations.call(mockExecuteFunctions, [{ json: {} }]);

		expect(result).toHaveLength(1);
		expect(result[0].json).toEqual({ error: 'API Error' });
	});

	it('should throw error when continueOnFail is false', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValue('getOutput');
		mockExecuteFunctions.continueOnFail.mockReturnValue(false);
		mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

		await expect(executeOutputOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('API Error');
	});
});

describe('Transaction Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.stardust-mainnet.iotaledger.net',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'IOTA/Shimmer Transaction Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getTransaction', () => {
		it('should get transaction successfully', async () => {
			const mockResponse = {
				data: {
					transactionId: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
					essence: { type: 1 },
				},
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTransaction')
				.mockReturnValueOnce('iota')
				.mockReturnValueOnce('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef')
				.mockReturnValueOnce(false);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeTransactionOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.stardust-mainnet.iotaledger.net/api/core/v2/transactions/1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle invalid transaction ID format', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTransaction')
				.mockReturnValueOnce('iota')
				.mockReturnValueOnce('invalid-id');

			const items = [{ json: {} }];

			await expect(executeTransactionOperations.call(mockExecuteFunctions, items))
				.rejects.toThrow('Invalid transaction ID format');
		});
	});

	describe('submitTransaction', () => {
		it('should submit transaction successfully', async () => {
			const mockTransactionData = {
				essence: {
					type: 1,
					inputs: [],
					outputs: [],
				},
				unlocks: [],
			};

			const mockResponse = {
				transactionId: '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
				blockId: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('submitTransaction')
				.mockReturnValueOnce('iota')
				.mockReturnValueOnce(mockTransactionData);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeTransactionOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.stardust-mainnet.iotaledger.net/api/core/v2/transactions',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				body: mockTransactionData,
				json: true,
			});
		});

		it('should handle API error during submission', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('submitTransaction')
				.mockReturnValueOnce('shimmer')
				.mockReturnValueOnce({});

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Transaction validation failed'));

			const items = [{ json: {} }];

			await expect(executeTransactionOperations.call(mockExecuteFunctions, items))
				.rejects.toThrow('Transaction validation failed');
		});
	});

	describe('getTransactionIncludedBlock', () => {
		it('should get transaction included block successfully', async () => {
			const mockResponse = {
				block: {
					blockId: 'abcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
					parents: [],
					payload: {},
				},
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTransactionIncludedBlock')
				.mockReturnValueOnce('shimmer')
				.mockReturnValueOnce('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const items = [{ json: {} }];
			const result = await executeTransactionOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.shimmer.network/api/core/v2/transactions/1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef/included-block',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle error with continueOnFail enabled', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getTransactionIncludedBlock')
				.mockReturnValueOnce('iota')
				.mockReturnValueOnce('1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');

			mockExecuteFunctions.continueOnFail.mockReturnValue(true);
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Transaction not found'));

			const items = [{ json: {} }];
			const result = await executeTransactionOperations.call(mockExecuteFunctions, items);

			expect(result).toEqual([{
				json: { error: 'Transaction not found' },
				pairedItem: { item: 0 },
			}]);
		});
	});
});

describe('Address Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.stardust-mainnet.iotaledger.net',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getAddressInfo operation', () => {
		it('should get address info successfully', async () => {
			const mockResponse = {
				address: 'iota1qpszqzadsym6wpppd6z037dvlejmjuke7s24hm95s9fg9vpua7vluaw60xu',
				balance: '1000000',
				dustAllowed: true,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAddressInfo')
				.mockReturnValueOnce('iota1qpszqzadsym6wpppd6z037dvlejmjuke7s24hm95s9fg9vpua7vluaw60xu');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.stardust-mainnet.iotaledger.net/api/core/v2/addresses/iota1qpszqzadsym6wpppd6z037dvlejmjuke7s24hm95s9fg9vpua7vluaw60xu',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle getAddressInfo errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAddressInfo')
				.mockReturnValueOnce('invalid-address');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid address format'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { error: 'Invalid address format' },
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('getAddressBalance operation', () => {
		it('should get address balance successfully', async () => {
			const mockResponse = {
				balance: '5000000',
				dustAllowed: true,
				ledgerIndex: 12345,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAddressBalance')
				.mockReturnValueOnce('iota1qpszqzadsym6wpppd6z037dvlejmjuke7s24hm95s9fg9vpua7vluaw60xu');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.stardust-mainnet.iotaledger.net/api/core/v2/addresses/iota1qpszqzadsym6wpppd6z037dvlejmjuke7s24hm95s9fg9vpua7vluaw60xu/balance',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});

	describe('getAddressOutputs operation', () => {
		it('should get address outputs successfully without includeSpent', async () => {
			const mockResponse = {
				outputs: ['0x123', '0x456'],
				pageSize: 100,
				cursor: null,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAddressOutputs')
				.mockReturnValueOnce('iota1qpszqzadsym6wpppd6z037dvlejmjuke7s24hm95s9fg9vpua7vluaw60xu')
				.mockReturnValueOnce(false);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.stardust-mainnet.iotaledger.net/api/core/v2/addresses/iota1qpszqzadsym6wpppd6z037dvlejmjuke7s24hm95s9fg9vpua7vluaw60xu/outputs',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should get address outputs successfully with includeSpent', async () => {
			const mockResponse = {
				outputs: ['0x123', '0x456', '0x789'],
				pageSize: 100,
				cursor: null,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAddressOutputs')
				.mockReturnValueOnce('iota1qpszqzadsym6wpppd6z037dvlejmjuke7s24hm95s9fg9vpua7vluaw60xu')
				.mockReturnValueOnce(true);
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeAddressOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: mockResponse,
				pairedItem: { item: 0 },
			}]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.stardust-mainnet.iotaledger.net/api/core/v2/addresses/iota1qpszqzadsym6wpppd6z037dvlejmjuke7s24hm95s9fg9vpua7vluaw60xu/outputs?includeSpent=true',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});
});

describe('Milestone Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.stardust-mainnet.iotaledger.net',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getMilestone', () => {
		it('should retrieve a milestone by ID', async () => {
			const mockMilestone = {
				milestoneId: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
				index: 12345,
				timestamp: 1640995200000,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getMilestone')
				.mockReturnValueOnce('0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef');
			
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockMilestone);

			const result = await executeMilestoneOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.stardust-mainnet.iotaledger.net/api/core/v2/milestones/0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: mockMilestone,
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle errors when getting milestone by ID', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getMilestone')
				.mockReturnValueOnce('invalid-id');
			
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid milestone ID'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeMilestoneOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { error: 'Invalid milestone ID' },
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('getMilestoneByIndex', () => {
		it('should retrieve a milestone by index', async () => {
			const mockMilestone = {
				milestoneId: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
				index: 54321,
				timestamp: 1640995800000,
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getMilestoneByIndex')
				.mockReturnValueOnce(54321);
			
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockMilestone);

			const result = await executeMilestoneOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.stardust-mainnet.iotaledger.net/api/core/v2/milestones/by-index/54321',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: mockMilestone,
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle errors when getting milestone by index', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getMilestoneByIndex')
				.mockReturnValueOnce(-1);
			
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Invalid milestone index'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeMilestoneOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { error: 'Invalid milestone index' },
				pairedItem: { item: 0 },
			}]);
		});
	});

	describe('getLatestMilestone', () => {
		it('should retrieve the latest milestone', async () => {
			const mockLatestMilestone = {
				milestoneId: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
				index: 99999,
				timestamp: 1640996400000,
			};

			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getLatestMilestone');
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockLatestMilestone);

			const result = await executeMilestoneOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.stardust-mainnet.iotaledger.net/api/core/v2/milestones/latest',
				headers: {
					'Authorization': 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toEqual([{
				json: mockLatestMilestone,
				pairedItem: { item: 0 },
			}]);
		});

		it('should handle errors when getting latest milestone', async () => {
			mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getLatestMilestone');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Network error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeMilestoneOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{
				json: { error: 'Network error' },
				pairedItem: { item: 0 },
			}]);
		});
	});

	it('should throw error for unknown operation', async () => {
		mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('unknownOperation');

		await expect(executeMilestoneOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Unknown operation: unknownOperation');
	});
});

describe('NativeToken Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-api-key',
        baseUrl: 'https://api.stardust-mainnet.iotaledger.net',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getTokenInfo operation', () => {
    it('should get token information successfully', async () => {
      const tokenId = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12';
      const expectedResponse = {
        tokenId: tokenId,
        foundryId: '0xfoundryid123',
        totalSupply: '1000000',
        symbol: 'TEST',
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTokenInfo')
        .mockReturnValueOnce(tokenId);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(expectedResponse);

      const result = await executeNativeTokenOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: `https://api.stardust-mainnet.iotaledger.net/api/core/v2/tokens/${tokenId}`,
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{
        json: expectedResponse,
        pairedItem: { item: 0 },
      }]);
    });

    it('should handle getTokenInfo error', async () => {
      const tokenId = '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12';
      const error = new Error('Token not found');

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getTokenInfo')
        .mockReturnValueOnce(tokenId);

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeNativeTokenOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{
        json: { error: 'Token not found' },
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('queryTokens operation', () => {
    it('should query tokens successfully', async () => {
      const foundryId = '0xfoundryid123456789012345678901234567890123456789012345678901234';
      const aliasAddress = 'iota1qp9427varyc05py79ajku89xarfgkj74tpel5egr9y7xu3wpfc4lkpx0l86';
      const expectedResponse = {
        tokens: [
          { tokenId: '0xtoken1', foundryId: foundryId },
          { tokenId: '0xtoken2', foundryId: foundryId },
        ],
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('queryTokens')
        .mockReturnValueOnce(foundryId)
        .mockReturnValueOnce(aliasAddress);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(expectedResponse);

      const result = await executeNativeTokenOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.stardust-mainnet.iotaledger.net/api/core/v2/tokens/query',
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        body: {
          foundryId: foundryId,
          aliasAddress: aliasAddress,
        },
        json: true,
      });

      expect(result).toEqual([{
        json: expectedResponse,
        pairedItem: { item: 0 },
      }]);
    });

    it('should handle queryTokens error', async () => {
      const error = new Error('Query failed');

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('queryTokens')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeNativeTokenOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(result).toEqual([{
        json: { error: 'Query failed' },
        pairedItem: { item: 0 },
      }]);
    });
  });

  describe('getFoundry operation', () => {
    it('should get foundry information successfully', async () => {
      const foundryId = '0xfoundryid123456789012345678901234567890123456789012345678901234';
      const expectedResponse = {
        foundryId: foundryId,
        aliasAddress: 'iota1qp9427varyc05py79ajku89xarfgkj74tpel5egr9y7xu3wpfc4lkpx0l86',
        tokenScheme: 'simple',
        mintedTokens: '500000',
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getFoundry')
        .mockReturnValueOnce(foundryId);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(expectedResponse);

      const result = await executeNativeTokenOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      );

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: `https://api.stardust-mainnet.iotaledger.net/api/core/v2/foundries/${foundryId}`,
        headers: {
          'Authorization': 'Bearer test-api-key',
          'Content-Type': 'application/json',
        },
        json: true,
      });

      expect(result).toEqual([{
        json: expectedResponse,
        pairedItem: { item: 0 },
      }]);
    });

    it('should handle getFoundry error', async () => {
      const foundryId = '0xfoundryid123456789012345678901234567890123456789012345678901234';
      const error = new Error('Foundry not found');

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getFoundry')
        .mockReturnValueOnce(foundryId);

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
      mockExecuteFunctions.continueOnFail.mockReturnValue(false);

      await expect(executeNativeTokenOperations.call(
        mockExecuteFunctions,
        [{ json: {} }],
      )).rejects.toThrow('Foundry not found');
    });
  });
});

describe('NodeInfo Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({
        apiKey: 'test-key',
        baseUrl: 'https://api.stardust-mainnet.iotaledger.net',
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: {
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn(),
      },
    };
  });

  describe('getNodeInfo operation', () => {
    it('should get node info successfully', async () => {
      const mockResponse = {
        name: 'HORNET',
        version: '2.0.0',
        status: {
          isHealthy: true,
          latestMilestoneIndex: 12345,
          confirmedMilestoneIndex: 12344,
        },
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getNodeInfo')
        .mockReturnValueOnce({});
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNodeInfoOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.stardust-mainnet.iotaledger.net/api/core/v2/info',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-key',
        },
        json: true,
      });
    });

    it('should handle getNodeInfo errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getNodeInfo')
        .mockReturnValueOnce({});
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      await expect(
        executeNodeInfoOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('API Error');
    });
  });

  describe('getProtocolParameters operation', () => {
    it('should get protocol parameters successfully', async () => {
      const mockResponse = {
        version: 2,
        networkName: 'iota-mainnet',
        bech32Hrp: 'iota',
        minPowScore: 1500,
        tokenSupply: '4600000000000000',
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getProtocolParameters')
        .mockReturnValueOnce({});
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNodeInfoOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.stardust-mainnet.iotaledger.net/api/core/v2/info/protocol-parameters',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-key',
        },
        json: true,
      });
    });

    it('should handle getProtocolParameters errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getProtocolParameters')
        .mockReturnValueOnce({});
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Protocol Error'));

      await expect(
        executeNodeInfoOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Protocol Error');
    });
  });

  describe('getNodeHealth operation', () => {
    it('should get node health successfully', async () => {
      const mockResponse = {
        isHealthy: true,
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getNodeHealth')
        .mockReturnValueOnce({});
      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeNodeInfoOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json).toEqual(mockResponse);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.stardust-mainnet.iotaledger.net/health',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer test-key',
        },
        json: true,
      });
    });

    it('should handle getNodeHealth errors', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getNodeHealth')
        .mockReturnValueOnce({});
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Health Check Error'));

      await expect(
        executeNodeInfoOperations.call(mockExecuteFunctions, [{ json: {} }])
      ).rejects.toThrow('Health Check Error');
    });
  });

  describe('continueOnFail', () => {
    it('should continue on fail when enabled', async () => {
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getNodeInfo')
        .mockReturnValueOnce({});
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));

      const result = await executeNodeInfoOperations.call(
        mockExecuteFunctions,
        [{ json: {} }]
      );

      expect(result).toHaveLength(1);
      expect(result[0].json.error).toBe('API Error');
    });
  });
});
});
