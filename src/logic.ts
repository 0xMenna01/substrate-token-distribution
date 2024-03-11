import { ApiPromise, Keyring } from '@polkadot/api'
import { Balance, MAILING_FILE_PATH, MILING_DEST_PATH, Perbill, WalletDistribution } from './types'
import { ApiManager, logMessage } from './config'
import * as fs from 'fs'

export class TokenDistributionExecutor {
  private manager: ApiManager

  public constructor(manager: ApiManager) {
    this.manager = manager
  }

  private async getFreeBalance() {
    const address = this.manager.keyPair().address
    const accountData: any = await this.manager.api.query.system.account(address)

    return new Balance(accountData.data.free)
  }

  async checkBalanceAndSend() {
    const thresholdAmount = this.manager.config.minimumBalanceThreshold
    let totalValue = await this.getFreeBalance()
    totalValue.subtract_saturating(this.manager.config.amountForFees)

    if (totalValue.isAtLeast(thresholdAmount)) {
      const api = this.manager.api
      const keyPair = this.manager.keyPair()
      // Prepare batch
      let calls = []
      const wallets = this.manager.config.dist
      for (const { address, perbill } of wallets) {
        const value = totalValue.fromPerbill(perbill)
        const transferTx = api.tx.balances.transferKeepAlive(address, value.toString())
        logMessage(`Address ${address} will recieve ${value.toString()} tokens`)

        // Add to batch
        calls.push(transferTx)
      }

      // Sign and send transaction
      const batchTxHash = await api.tx.utility.batchAll(calls).signAndSend(keyPair)
      return batchTxHash
    }

    return false
  }

  public async execute() {
    console.log('\n')
    logMessage(`Starting distribution..`)

    const res = await this.checkBalanceAndSend()
    if (res) {
      logMessage('SUCCESS')
      const txMessage = `Transaction submitted with hash: ${res}`
      logMessage(txMessage)
      if (this.manager.config.mailing) {
        // write email to file
        fs.writeFileSync(
          MAILING_FILE_PATH,
          `${this.manager.config.chainName} token distribution was executed successfully.\n${txMessage}`,
        )
        fs.writeFileSync(MILING_DEST_PATH, this.manager.config.mailing.to)
      }
    } else {
      logMessage('Tokens were not distributed because configuration conditions were not met')
    }
  }
}
