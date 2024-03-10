### Configuration

Before running the script, ensure you have configured the `config.json` file with the following information:

- **rpcEndpoint:** The RPC endpoint of the Substrate-based blockchain network. Example: `"wss://rococo-rpc.polkadot.io"`
- **chainName:** The name of the blockchain network.
- **tokenDecimals:** Number of decimals for token representation. To obtain this value either:
  - Check the official documentation of the blockchain project.
  - Use Polkadot JS UI chainstate section to query the system pallet (account extrinisc) and divide the returned free amount for the account balance displayed in the account section.
- **keyType:** The type of cryptographic curve used for key generation. Supported values: `"ed25519"`, `"sr25519"`, `"ecdsa"`, `"ethereum"`.
- **privateSeed:** Your hex private key for signing transactions.
- **minimumBalanceThreshold:** Minimum balance required for token distribution to occur.
- **amountForFees:** Amount of tokens reserved for transaction fees.
- **minutesDistributionInterval:** Interval (in minutes) at which token distribution occurs.
- **walletsWeight:** An object containing wallet addresses and their corresponding weight for token distribution.
- **mailing:** Configuration for email notifications (optional). If not needed, you can remove this section from `config.json`. A mailing service is required, since the script executes the mail command.

### Execution

To execute the script:

1. Clone the repository: `git clone https://github.com/0xMenna01/substrate-token-distribution`
2. Navigate to the cloned directory: `cd substrate-token-distribution`
3. Configure the `config.json` file as described above.
4. Run the script: `./token-distribution.sh`

### Logging

The script will log its operations in a file called `distribution.log`. You can monitor this log file to track the script's activities and any errors encountered during execution.
