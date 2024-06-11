"use client"
import Image from "next/image";
import { thirdwebClient } from "../../utils/thirdweb";
import {
  ThirdwebProvider,
  ConnectButton,
} from "thirdweb/react";
import {
  createWallet,
  walletConnect,
  inAppWallet,
} from "thirdweb/wallets";
import { getContract } from "thirdweb";
import { baseSepolia } from "thirdweb/chains";
import { TransactionButton } from "thirdweb/react";
import { claimTo } from "thirdweb/extensions/erc1155";
import { useConnectedWallets } from "thirdweb/react";
import { getOwnedNFTs } from "thirdweb/extensions/erc1155";
import { useEffect, useState } from "react";
import { MediaRenderer } from "thirdweb/react";

export default function Home() {
  const connectedWallets: any = useConnectedWallets();
  const address = connectedWallets[0]?.getAccount()?.address ?? ''
  const [userNFTs, setUserNFTs] = useState<any[]>()
  const BASE_CONTRACT_ADDRESS = '0xBc6928c1e9e86D073744abE1323f397b4370dc8e'

  const wallets = [
    createWallet("io.metamask"),
    createWallet("com.coinbase.wallet"),
    walletConnect(),
    inAppWallet({
      auth: {
        options: [
          "email",
          "google",
          "apple",
          "facebook",
          "phone",
        ],
      },
    }),
  ];

  const contractTransaction = getContract({
    client: thirdwebClient,
    chain: baseSepolia,
    address: BASE_CONTRACT_ADDRESS,
  });

  useEffect(() => {
    const getNFTsbyUserAddress = async () => {
      const nfts = await getOwnedNFTs({
        contract: contractTransaction,
        address,
      });
      setUserNFTs(nfts)
    }

    getNFTsbyUserAddress()
  }, [address])

  console.log('userNFTs', userNFTs);

  const hasNFT = (tokenId: string, contractAddress: string, nftArray: any[]) => {
    return nftArray.some(nft => nft.id.toString() == tokenId && BASE_CONTRACT_ADDRESS == contractAddress);
  }

  return (
    <ThirdwebProvider>
      <main className="flex flex-col items-center justify-between p-10">
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm flex">
          <a
            className="pointer-events-none flex place-items-center gap-2 lg:pointer-events-auto lg:p-0"
            href="https://www.hallos.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/HallosWhite.svg"
              alt="Vercel Logo"
              width={100}
              height={24}
              priority
            />
          </a>
          <div>

            <ConnectButton
              client={thirdwebClient}
              wallets={wallets}
              theme={"dark"}
              connectModal={{ size: "wide" }}
            />
          </div>
        </div>

        <div className="w-full mt-8">
          <h1 className="text-4xl font-bold">Tu Primera Dapp en Base</h1>

          <div className="mt-4">
            <TransactionButton
              transaction={() => {
                return claimTo({
                  contract: contractTransaction,
                  to: address ?? '',
                  tokenId: BigInt(0),
                  quantity: BigInt(1),
                })
              }}
              onTransactionConfirmed={() => {
                alert('Confirmed');
              }}
              onError={(e) => {
                console.log('Error', e);
              }}
            >
              Mint Base NFT
            </TransactionButton>
          </div>

          <div className="mt-4">
            <h2 className="text-2xl">Mis NFTs</h2>
            {userNFTs?.map((item, index) => {
              return (
                <div className="border-solid border-2 border-gray-500 w-max rounded-md" key={index}>
                  <MediaRenderer
                    client={thirdwebClient}
                    src={item.metadata.image}
                    width={'200px'}
                    height={'200px'}
                  />
                  <div className="p-2">
                    <p>{item.metadata.name}</p>
                    <p>Owned: {item.supply.toString()}</p>
                  </div>
                </div>
              )
            })}
          </div>

          {hasNFT('0', BASE_CONTRACT_ADDRESS, userNFTs ?? []) &&
            <div className="mt-4">
              <p className="text-xl">Contenido exclusivo</p>
            </div>
          }
        </div>
      </main>
    </ThirdwebProvider>
  );
}
