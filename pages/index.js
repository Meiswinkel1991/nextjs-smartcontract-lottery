import Head from "next/head"
import styles from "../styles/Home.module.css"

import Header from "../components/Header"
import LotteryEntrance from "../components/LotteryEntrance"

export default function Home() {
    return (
        <div className="container bg-gradient-to-r from-blue-500 to-blue-200 h-screen text-white">
            <Head>
                <title>Decentralized Lottery</title>
                <meta name="description" content="My first lottery" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* header / connect button / navbar */}
            <Header />
            <LotteryEntrance />
        </div>
    )
}
