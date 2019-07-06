import arweave from './arweaveSetup';
import {currentUnixTime, getAppName} from './utils';

export const getWalletAddress = async wallet => arweave.wallets.jwkToAddress(wallet);

export const getAllPortfolioTransactions = async walletAddress => {
    const query = {
        op: 'and',
        expr1: {
            op: 'equals',
            expr1: 'from',
            expr2: walletAddress
        },
        expr2: {
            op: 'equals',
            expr1: 'App-Name',
            expr2: getAppName()
        }
    };

    const txids = await arweave.arql(query);
    const transactions = await Promise.all(txids.map(txid => arweave.transactions.get(txid)));

    /*const files = await Promise.all(
        transactions.map(transaction => transaction.get('data', {decode: true}))
    );
    transactions.forEach(transaction => transaction.get('tags').forEach(tag => {
        let key = tag.get('name', {decode: true, string: true});
        let value = tag.get('value', {decode: true, string: true});
        console.log(`${key} : ${value}`);
    }));


    console.log(files);
    return files;*/
    console.log(transactions);
    return transactions;
};

export const addTransaction = async (transactionData, wallet) => {
    return false;
};

export const uploadFile = async (content, name, size, wallet) => {
    const transaction = await arweave.createTransaction({data: content}, wallet);
    transaction.addTag('App-Name', getAppName());
    transaction.addTag('name', name);
    transaction.addTag('size', size);

    await arweave.transactions.sign(transaction, wallet);
    await arweave.transactions.post(transaction);

    return true;
};
