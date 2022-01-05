import {createContext, useEffect, useState} from 'react';
import { ethers } from 'ethers'

import { contractABI, contractAddress } from '../utils/constants'; 

interface IFormData {
    addressTo: string, 
    amount: string, 
    keyword: string, 
    message: string
}

interface ITransaction {
    addressTo: string, 
    addressFrom: string, 
    timestamp: string, 
    message: string, 
    keyword: string, 
    amount: string
}

interface ContextState {
    connectWallet: Function,
    currentAccount: string | null,
    formData: IFormData, 
    setformData: Function, 
    handleChange: Function,
    sendTransaction: Function,
    transactions: ITransaction[],
    isLoading: boolean
}

export const TransactionContext = createContext({} as ContextState)

declare const window: any

const { ethereum } = window

const createEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionsContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionsContract;
  };

export const TransactionProvider = ({children}: any) => {
    const [currentAccount, setCurrentAccount] = useState("")
    const [formData, setformData] = useState({addressTo: "", amount: "", keyword: "", message: ""})
    const [isLoading, setIsLoading] = useState(false)
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'))
    const [transactions, setTransactions] = useState([])

    const handleChange = (e: { target: HTMLInputElement }, name: string) => {
        setformData((prevState: IFormData) => ({ ...prevState, [name]: e.target.value }));
    };
    
    const getAllTransactions =async () => {
        try {
            if(!ethereum) return alert("Please install metamask")
            const transactionContract = createEthereumContract()
            const availableTransactions = await transactionContract.getAllTransactions()
            
            interface BigNumber {
                _hex: string,
                _isBigNumber: boolean
            }

            interface ITransaction {
                receiver: string,
                sender: string,
                timestamp: any,
                message: string,
                keyword: string,
                amount: BigNumber
            }

            const structuredTransactions = availableTransactions.map((transaction:ITransaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }))
            setTransactions(structuredTransactions)
        } catch (error) {
            console.log(error)
        }
    }

    const checkIfWalletIsConnected = async () => {
        try {
            if(!ethereum) return alert("Please install metamask")

            const accounts = await ethereum.request({method: 'eth_accounts'})
    
            if(accounts.length) {
                setCurrentAccount(accounts[0])
                getAllTransactions()
            } else {
                console.log("No accounts found.")
            }
        } catch (error) {
            console.error(error)
            throw new Error("No ethereum object.")
        }

    }

    const checkIfTransactionsExist = async () => {
        try {
            const transactionContract = createEthereumContract()
            const transactionCount = await transactionContract.getTransactionCount()
            window.localStorage.setItem("transactionCount", transactionCount)
        } catch (error) {
            console.error(error)
            throw new Error("No ethereum object.")
        }
    }

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please install metamask")
            
            const accounts = await ethereum.request({method: 'eth_requestAccounts'})

            setCurrentAccount(accounts[0])
            location.reload()
        } catch (error) {
            console.error(error)
            throw new Error("No ethereum object.")
        }

    }

    const sendTransaction = async () => {
        try {
            if(!ethereum) return alert("Please install metamask")

            const { addressTo, amount, keyword, message } = formData
            const transactionContract = createEthereumContract()
            const parsedAmount = ethers.utils.parseEther(amount)
            
            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: "0x5208",
                    value: parsedAmount._hex
                }]
            })

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword)
            setIsLoading(true)
            console.log(`Loading - ${transactionHash.hash}`)
            await transactionHash.wait()
            setIsLoading(true)
            console.log(`Success - ${transactionHash.hash}`)

            const transactionCount = await transactionContract.getTransactionCount()

            setTransactionCount(transactionCount.toNumber())
            location.reload()
        } catch (error) {
            console.error(error)
            throw new Error("No ethereum object.")
        }
    }

    useEffect(() => {
        checkIfWalletIsConnected()
        checkIfTransactionsExist()
    }, [])

    return (
        <TransactionContext.Provider value={{ connectWallet, currentAccount, formData, setformData, handleChange, sendTransaction, transactions, isLoading }}>
            {children}
        </TransactionContext.Provider>
    )
}