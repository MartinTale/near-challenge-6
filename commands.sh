foil menu beach athlete unaware safe lemon flag ripple message barrel visual 

near deploy --wasmFile res/fungible_token.wasm --accountId stress.testnet

near call stress.testnet new_default_meta '{"owner_id": "'stress.testnet'", "total_supply": "10000000000"}' --accountId stress.testnet

near call stress.testnet storage_deposit '' --accountId martint.testnet --amount 0.00125

near call stress.testnet ft_mint '{"receiver_id": "martint.testnet", "amount":"10"}' --accountId martint.testnet

near view stress.testnet ft_balance_of '{"account_id": "'stress.testnet'"}'
near view stress.testnet ft_balance_of '{"account_id": "'martint.testnet'"}'

near view stress.testnet ft_total_supply

near call stress.testnet ft_transfer '{"receiver_id": "spiritdungeons.testnet", "amount": "1000"}' --accountId martint.testnet --deposit 0.000000000000000000000001

near call stress.testnet storage_deposit '' --accountId spiritdungeons.testnet --amount 0.00125
