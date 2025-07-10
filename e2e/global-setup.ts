import path from 'node:path'

import dotenv from 'dotenv'

function globalSetup() {
  dotenv.config({ path: path.resolve(__dirname, '..', '.env') })
}

export default globalSetup
