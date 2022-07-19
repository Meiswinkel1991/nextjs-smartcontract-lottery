import { useEffect, useState } from "react"
import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"
import { abi, contractAddresses } from "../constants"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const [entranceFee, setEntranceFee] = useState("0")
    const [numberOfPlayers, setNumberOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("")

    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] : null

    const dispatch = useNotification()

    const {
        runContractFunction: enterRaffle,
        isFetching,
        isLoading,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "enterRaffle",
        params: {},
        msgValue: entranceFee,
    })

    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getEntranceFee",
        params: {},
    })

    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })

    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: raffleAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    const updateUi = async () => {
        const entranceFeeFromCall = (await getEntranceFee()).toString()
        const recentWinnerFromCall = await getRecentWinner()
        const numberOfPlayersFromCall = (await getNumberOfPlayers()).toString()

        setRecentWinner(recentWinnerFromCall)
        setNumberOfPlayers(numberOfPlayersFromCall)
        setEntranceFee(entranceFeeFromCall)
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUi()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx)
        updateUi()
    }
    const handleNewNotification = () => {
        dispatch({
            type: "info",
            message: "Transaction complete!",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    return (
        <div className=" bg-white rounded-xl shadow-lg mt-8 pb-4  text-blue-500 w-2/3 mx-auto flex justify-between">
            <div>
                <h1 className="py-4 px-4 font-bold text-3xl ">Lottery</h1>
                {raffleAddress ? (
                    <div>
                        <button
                            className="rounded-xl bg-blue-500 text-white border-2 border-blue-500 hover:bg-white hover:text-blue-500  px-4 py-2 ml-4 mb-4 box-border"
                            onClick={async () => {
                                await enterRaffle({
                                    onSuccess: handleSuccess,
                                    onError: (error) => console.log(error),
                                })
                            }}
                            disabled={isLoading || isFetching}
                        >
                            {isLoading || isFetching ? (
                                <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                            ) : (
                                "Enter the raffle"
                            )}
                        </button>
                        <div className="pl-4 mb-4  ">
                            Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH
                        </div>
                        <div className="pl-4 mb-4  ">Number of Players: {numberOfPlayers}</div>
                        <div className="pl-4 mb-4  ">Recent Winner: {recentWinner}</div>
                    </div>
                ) : (
                    <div className="pl-4 mb-4"> Please connect to a supported chain </div>
                )}
            </div>
        </div>
    )
}
