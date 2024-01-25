export const payoutContractAbi = [
  {
    inputs: [
      { internalType: 'uint256', name: '_id', type: 'uint256' },
      {
        components: [
          { internalType: 'address payable', name: 'account', type: 'address' },
          { internalType: 'uint256', name: 'value', type: 'uint256' }
        ],
        internalType: 'struct libERC721Fee.Part[]',
        name: 'receivers',
        type: 'tuple[]'
      },
      {
        internalType: 'bytes',
        name: 'signature',
        type: 'bytes'
      }
    ],
    name: 'makePayment',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: '_admin',
        type: 'address'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'OwnershipTransferred',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: 'id',
        type: 'uint256'
      },
      {
        indexed: true,
        internalType: 'uint256',
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'PaymentReceived',
    type: 'event'
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address'
      }
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    stateMutability: 'nonpayable',
    type: 'fallback'
  },
  {
    inputs: [
      {
        internalType: 'address payable',
        name: '_newAdmin',
        type: 'address'
      }
    ],
    name: 'updateAdmin',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool'
      }
    ],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'price',
        type: 'uint256'
      },
      {
        components: [
          {
            internalType: 'address payable',
            name: 'account',
            type: 'address'
          },
          {
            internalType: 'uint256',
            name: 'value',
            type: 'uint256'
          }
        ],
        internalType: 'struct libERC721Fee.Part[]',
        name: 'receivers',
        type: 'tuple[]'
      }
    ],
    name: '_hashData',
    outputs: [
      {
        internalType: 'bytes32',
        name: '',
        type: 'bytes32'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function'
  }
]
