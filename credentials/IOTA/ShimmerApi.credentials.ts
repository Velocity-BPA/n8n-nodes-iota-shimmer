import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class IOTAShimmerApi implements ICredentialType {
	name = 'iotaShimmerApi';
	displayName = 'IOTA/Shimmer API';
	documentationUrl = 'https://wiki.iota.org/apis/';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'API key for IOTA/Shimmer API authentication (if required)',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.stardust-mainnet.iotaledger.net',
			description: 'Base URL for the IOTA/Shimmer API endpoint',
		},
	];
}