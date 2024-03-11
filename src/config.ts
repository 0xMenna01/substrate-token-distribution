import { ApiPromise, Keyring, WsProvider } from '@polkadot/api'

import * as fs from 'fs'
import { Balance, Config, JsonConfig, Perbill, TOTAL_PERCENTAGE, WalletDistribution } from './types'

export function readConfig(): Config {
  const rawData = fs.readFileSync('config.json')
  const config: JsonConfig = JSON.parse(rawData.toString())
  Balance.decimals = config.tokenDecimals

  const walletWeights = config.walletsWeight
  let walletDist: WalletDistribution[] = []
  let totalPercentage: Perbill = new Perbill(BigInt(0))
  for (const address in walletWeights) {
    const weight = new Perbill(BigInt(walletWeights[address]))
    walletDist.push({ address: address, perbill: weight })
    totalPercentage.add(weight)
  }

  if (totalPercentage.value != TOTAL_PERCENTAGE) {
    console.log('Sum of percentages does not reach 100..')
    process.exit(-1)
  }

  return {
    rpcEndpoint: config.rpcEndpoint,
    chainName: config.chainName,
    keyType: config.keyType,
    privateSeed: config.privateSeed,
    minimumBalanceThreshold: Balance.fromNumber(config.minimumBalanceThreshold),
    amountForFees: Balance.fromNumber(config.amountForFees),
    dist: walletDist,
    mailing: config.mailing,
  }
}

export function logMessage(message: string) {
  const timestamp = new Date().toISOString()
  console.log(`\x1b[1m\x1b[34m[INFO]\x1b[0m [${timestamp}] ${message}`)
}

export class ApiManager {
  public api: ApiPromise
  public config: Config
  private keyring: Keyring

  public constructor(api: ApiPromise, config: Config, keyring: Keyring) {
    this.api = api
    this.config = config
    this.keyring = keyring
  }

  public keyPair() {
    return this.keyring.addFromUri(this.config.privateSeed)
  }
}

export class ApiBuilder {
  static async build(): Promise<ApiManager> {
    const config = readConfig()
    const api = await ApiPromise.create({ provider: new WsProvider(config.rpcEndpoint) })
    const keyring = new Keyring({ type: config.keyType })

    return new ApiManager(api, config, keyring)
  }
}
