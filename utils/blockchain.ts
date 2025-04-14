// This is a mock implementation. In a real-world scenario, you'd integrate with an actual blockchain.

const blockchainStorage: { [key: string]: string } = {}

export async function addToBlockchain(key: string, data: string): Promise<void> {
  blockchainStorage[key] = data
}

export async function getFromBlockchain(key: string): Promise<string | null> {
  return blockchainStorage[key] || null
}
