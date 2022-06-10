import Head from "next/head"
import styles from "../styles/Home.module.css"

import Header from "../components/Header"

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>Decentralized Lottery</title>
                <meta name="description" content="My first lottery" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            {/* header / connect button / navbar */}
            <Header />
        </div>
    )
}
