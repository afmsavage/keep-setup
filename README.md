# Keep setup

This is a collection of scripts to:

1. Create a fresh wallet: `$ node keystore.js PASSWORDGOESHERE`
2. Request testnet Ether: `$ INFURA_API=APIKEYGOESHERE node faucet.js`
3. Request a keep grant: `$ node keep_grant.js`
4. Delegate stake to the fresh wallet and authorize the operator and sortition pools: `$ INFURA_API=APIKEYGOESHERE node access.js PASSWORDGOESHERE`
5. Authorize the random beacon operator for slashing: `$ INFURA_API=APIKEYGOESHERE node beacon_auth.js PASSWORDGOESHERE`
6. Send some (hardcoded right now) eth for bonding: `$ INFURA_API=APIKEYGOESHERE node deposit_eth.js PASSWORDGOESHERE`
7. Check if a given address has the necessary authorizations: `$ INFURA_API=APIKEYGOESHERE node auths.js ADDRESSGOESHERE`

These scripts are still somewhat brittle and require an API key for infura.io.
The scripts have the contract addresses hardcoded and are only meant to be used
with the Ropsten testnet.

Depedencies are installed via `npm install`.
