// Stellar testnet configuration for the Forge (v1 is testnet-only; mainnet
// arrives as a second entry here plus a network switcher, nothing else).

export const TESTNET = {
  id: "testnet" as const,
  rpcUrl: "https://soroban-testnet.stellar.org",
  horizonUrl: "https://horizon-testnet.stellar.org",
  friendbotUrl: "https://friendbot.stellar.org",
  passphrase: "Test SDF Network ; September 2015",
};

export function explorerContractUrl(contractId: string): string {
  return `https://stellar.expert/explorer/testnet/contract/${contractId}`;
}

export function explorerTxUrl(txHash: string): string {
  return `https://stellar.expert/explorer/testnet/tx/${txHash}`;
}
