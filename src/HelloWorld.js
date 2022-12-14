import {
    Button,
    DialogTitle,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material"
import { ethers } from "ethers"
import { useState } from "react"
import { contractAddress, abi } from "./constants"

const HelloWorld = () => {
    const [helloWorldText, setHelloWorldText] = useState("")
    const [connectButtonText, setConnectButtonText] = useState("Connect")
    const [from, setFrom] = useState("")
    const [errorMessage, setErrorMessage] = useState(null)

    const connectToMetamask = async () => {
        if (window.ethereum) {
            try {
                await window.ethereum.request({
                    method: "eth_requestAccounts",
                })
                setConnectButtonText("Connected!")
            } catch (err) {
                console.log(err)
                setErrorMessage("There was a problem connecting to MetaMask")
            }
        } else {
            setErrorMessage("Install MetaMask")
        }
    }

    const helloWorld = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                )
                const signer = provider.getSigner()
                const contract = new ethers.Contract(
                    contractAddress,
                    abi,
                    signer
                )
                const helloWorld = await contract.helloWorld()
                setHelloWorldText(helloWorld)
            } catch (err) {
                console.log(err)
                setErrorMessage("There was a problem getting hello world")
            }
        } else {
            setErrorMessage("Install MetaMask")
        }
    }

    const updateFrom = async () => {
        if (window.ethereum) {
            try {
                const provider = new ethers.providers.Web3Provider(
                    window.ethereum
                )
                const signer = provider.getSigner()
                const contract = new ethers.Contract(
                    contractAddress,
                    abi,
                    signer
                )
                const transactionResponse = await contract.updateFrom(from)
                await listenForTransactionMine(transactionResponse, provider)
                console.log(`Done updating from to ${from}!`)
            } catch (err) {
                console.log(err)
                setErrorMessage("There was an error updating From")
            }
        } else {
            setErrorMessage("Install MetaMask")
        }
    }

    const listenForTransactionMine = async (transactionResponse, provider) => {
        console.log(`Mining ${transactionResponse.hash}...`)
        return new Promise((resolve, reject) => {
            provider.once(transactionResponse.hash, (transactionReceipt) => {
                console.log(
                    `Completed with ${transactionReceipt.confirmations} confirmations`
                )
                resolve()
            })
        })
    }

    return (
        <Paper elevation={3} sx={{ p: 3 }}>
            <Stack spacing={2}>
                <Button variant="contained" onClick={connectToMetamask}>
                    {connectButtonText}
                </Button>
                <Button
                    variant="contained"
                    color="success"
                    onClick={helloWorld}
                >
                    Test
                </Button>
                <DialogTitle>{helloWorldText}</DialogTitle>
                <TextField
                    id="outlined-basic"
                    label="From"
                    variant="outlined"
                    onChange={(e) => setFrom(e.target.value)}
                />
                <Button
                    color="secondary"
                    variant="contained"
                    onClick={updateFrom}
                >
                    Update From
                </Button>
                {errorMessage ? (
                    <Typography variant="body1" color="red">
                        Error: {errorMessage}
                    </Typography>
                ) : null}
            </Stack>
        </Paper>
    )
}

export default HelloWorld
