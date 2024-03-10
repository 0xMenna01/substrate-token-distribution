import { ApiBuilder, ApiManager, logMessage } from './config'
import { TokenDistributionExecutor } from './logic'

async function main() {
  // Construct the script manager holding configuration information
  const scriptManager = await ApiBuilder.build()

  const tokenDistributor = new TokenDistributionExecutor(scriptManager)
  await tokenDistributor.execute()
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(-1)
})
