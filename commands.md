crime virtual leopard high exhibit bomb wonder pact cotton used come document 

mt-near-challenge-5.testnet


near deploy --wasmFile res/non_fungible_token.wasm --accountId mt-near-challenge-5.testnet

near call mt-near-challenge-5.testnet new_default_meta '{"owner_id": "'mt-near-challenge-5.testnet'"}' --accountId mt-near-challenge-5.testnet

near view mt-near-challenge-5.testnet nft_metadata

near call mt-near-challenge-5.testnet nft_mint '{"token_id": "mt-5.testnet", "receiver_id": "'mt-near-challenge-5.testnet'", "token_metadata": { "title": "Olympus Mons", "description": "Tallest mountain in charted solar system", "media": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Olympus_Mons_alt.jpg/1024px-Olympus_Mons_alt.jpg", "copies": 1}}' --accountId mt-near-challenge-5.testnet --deposit 10

near view mt-near-challenge-5.testnet nft_metadata

near create-account alice.mt-near-challenge-5.testnet --masterAccount mt-near-challenge-5.testnet --initialBalance 10

near view mt-near-challenge-5.testnet nft_tokens_for_owner '{"account_id": "'alice.mt-near-challenge-5.testnet'"}'

near call mt-near-challenge-5.testnet nft_transfer '{"token_id": "0", "receiver_id": "alice.'mt-near-challenge-5.testnet'", "memo": "transfer ownership"}' --accountId mt-near-challenge-5.testnet --deposit 0.000000000000000000000001







near call mt-near-challenge-5.testnet nft_mint '{"token_id": "mt-5.testnet", "receiver_id": "'mt-near-challenge-5.testnet'", "token_metadata": { "title": "Olympus Mons", "description": "Tallest mountain in charted solar system", "media": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Olympus_Mons_alt.jpg/1024px-Olympus_Mons_alt.jpg", "copies": 1}}' --accountId mt-near-challenge-5.testnet --deposit 10

near view mt-near-challenge-5.testnet nft_tokens_for_owner '{"account_id": "'alice.mt-near-challenge-5.testnet'"}'
