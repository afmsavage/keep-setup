const ethers = require('ethers');

const TokenStaking = require("@keep-network/keep-core/artifacts/TokenStaking.json")
const TokenGrant = require("@keep-network/keep-core/artifacts/TokenGrant.json")
const BondedECDSAKeepFactory = require("@keep-network/keep-ecdsa/artifacts/BondedECDSAKeepFactory.json")
const TBTCSystem = require("@keep-network/tbtc/artifacts/TBTCSystem.json")
const KeepBonding = require("@keep-network/keep-ecdsa/artifacts/KeepBonding.json")
const RandomBeaconOperator = require("@keep-network/keep-core/artifacts/KeepRandomBeaconOperator.json")

if (process.argv.length < 3 || !process.argv[2]) {
	console.error('node checkup.js address');
	process.exit(1);
}

async function main() {
	let wallet
	try {
		const ip = new ethers.providers.InfuraProvider('ropsten', process.env.INFURA_API);
		let addr
		try {
			addr = ethers.utils.getAddress(process.argv[2])
		} catch (err) {
			console.error(`Invalid address supplied: ${err}`)
			process.exit(1)
		}

		const stakingContract = new ethers.Contract(TokenStaking.networks["3"].address, TokenStaking.abi, wallet);
		const grantContract = new ethers.Contract(TokenGrant.networks["3"].address, TokenGrant.abi, wallet);
		const ecdsaKFContract = new ethers.Contract(BondedECDSAKeepFactory.networks["3"].address, BondedECDSAKeepFactory.abi, wallet);
		const tbtcSysContract = new ethers.Contract(TBTCSystem.networks["3"].address, TBTCSystem.abi, wallet);
		const keepBondingContract = new ethers.Contract(KeepBonding.networks["3"].address, KeepBonding.abi, wallet);
		const beaconOpContract = new ethers.Contract(RandomBeaconOperator.networks["3"].address, RandomBeaconOperator.abi, ip);

		console.log(`Checking random beacon authorization`)
		const beaconAuth = await stakingContract.isAuthorizedForOperator(addr, beaconOpContract.address)
		console.log(`beacon authorization: ${beaconAuth}`)

		console.log(`Checking ECDSA/tBTC authorizations`)
		const ecdsaAuth = await stakingContract.isAuthorizedForOperator(addr, ecdsaKFContract.address)
		console.log(`bonded ECDSA Keep factory authorization: ${ecdsaAuth}`)

		const sortitionPoolAddress = await ecdsaKFContract.getSortitionPool(tbtcSysContract.address)
		const tbtcAuth = await keepBondingContract.hasSecondaryAuthorization(addr, sortitionPoolAddress)
		console.log(`tBTC system authorization: ${tbtcAuth}`)

		console.log(`\nAll systems authorized: ${beaconAuth && ecdsaAuth && tbtcAuth}`)

	} catch(err) {
		console.error(`Could not authorize: ${err.message}`)
		process.exit(1)
	}
}

main().catch(err => {
	console.error(err);
})
