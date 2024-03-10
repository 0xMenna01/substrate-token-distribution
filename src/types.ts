export type Percentage = number
export const TOTAL_PERCENTAGE: Percentage = 100
export const MAILING_FILE_PATH = 'resources/mail-content.txt'
export const MILING_DEST_PATH = 'resources/dest-email.txt'
export class Perbill {
  public value: bigint

  public constructor(percent: Percentage) {
    // check if percentage can be converted correctly
    const strPercent = percent.toString()
    let separatorIndex = strPercent.indexOf('.')
    if (separatorIndex == -1 && (strPercent.length == 1 || strPercent.length == 2)) {
      separatorIndex = 0
    } else if (separatorIndex == 1 || separatorIndex == 2) {
      const numOfDecimals = strPercent.length - separatorIndex - 1
      if (numOfDecimals > 7) {
        console.error('The number of decimals for the percentage can be maximum 7')
        process.exit(-1)
      }
    } else {
      console.error('Percentage has a bad format')
      process.exit(-1)
    }

    this.value = BigInt(percent * 10000000)
  }

  public toString() {
    return this.value.toString()
  }
}

export class Balance {
  public amount: bigint
  public static decimals: number

  public static fromNumber(amount: number) {
    const amountStr = (BigInt(amount) * 10n ** BigInt(this.decimals)).toString()
    return new Balance(amountStr)
  }

  public constructor(amount: string) {
    this.amount = BigInt(amount)
  }

  public fromPerbill(perbill: Perbill) {
    const strBalance = ((this.amount * perbill.value) / BigInt(1000000000)).toString()
    return new Balance(strBalance)
  }

  public isAtLeast(amount: Balance) {
    return this.amount >= amount.amount
  }

  public subtract_saturating(amount: Balance) {
    const value = this.amount - amount.amount
    value < 0n ? (this.amount = 0n) : (this.amount = value)
  }

  public toString() {
    return this.amount.toString()
  }
}

export interface WalletDistribution {
  address: string
  perbill: Perbill
}

export interface Config {
  rpcEndpoint: string
  chainName: string
  keyType: KeypairType
  privateSeed: string
  minimumBalanceThreshold: Balance
  amountForFees: Balance
  dist: WalletDistribution[]
  mailing?: EmailParams
}

export type KeypairType = 'ed25519' | 'sr25519' | 'ecdsa' | 'ethereum'

export interface JsonConfig {
  rpcEndpoint: string
  chainName: string
  tokenDecimals: number
  keyType: KeypairType
  privateSeed: string
  minimumBalanceThreshold: number
  amountForFees: number
  walletsWeight: { [address: string]: Percentage }
  mailing?: EmailParams
}

export type EmailParams = {
  to: string
}
