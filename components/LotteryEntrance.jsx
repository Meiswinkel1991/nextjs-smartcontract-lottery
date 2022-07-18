import { useEffect,useState } from "react"
import { useWeb3Contract } from "react-moralis"
import {useMoralis} from 'react-moralis'
import {abi,contractAddresses} from "../constants"
import { ethers } from "ethers"

export default function LotteryEntrance () {

    const[entranceFee,setEntranceFee] = useState("0")

    const {chainId: chainIdHex,isWeb3Enabled} = useMoralis()
    const chainId = parseInt(chainIdHex)
    const raffleAddress = chainId in contractAddresses ? contractAddresses[chainId][0] :null
    

    

    const {runContractFunction: enterRaffle} = useWeb3Contract({
        abi: abi ,
        contractAddress: raffleAddress  ,
        functionName: "enterRaffle"  ,
        params: {},
    })

    const {runContractFunction: getEntranceFee} = useWeb3Contract({
        abi: abi ,
        contractAddress: raffleAddress  ,
        functionName: "getEntranceFee"  ,
        params: {},
    })

    const updateUi = async () => {
        const entranceFeeFromCall = (await getEntranceFee()).toString()

        setEntranceFee(entranceFeeFromCall)
    }

    useEffect(() => {
        if(isWeb3Enabled){
            
            
            updateUi()
        }
    },[isWeb3Enabled])

    return(
        <div className=" bg-white rounded-xl shadow-lg mt-8 pb-4 mx-8">
            <h1 className="py-4 px-4 font-bold text-3xl">Lottery</h1>
            {raffleAddress ? (
                <div>
                    <div className="pl-4 mb-4 ">Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>    
                </div>
            ): (
                <div className="pl-4 mb-4"> Please connect to a supported chain </div>
            )}
        </div>
    )
}