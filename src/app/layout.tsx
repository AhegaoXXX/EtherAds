'use client'
import { ChakraProvider } from '@chakra-ui/react'
import { ThirdwebProvider } from '@thirdweb-dev/react'


const activeChain = "sepolia";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ThirdwebProvider activeChain={activeChain}>
          <ChakraProvider>
            <div>
              {children}
            </div>
          </ChakraProvider>
        </ThirdwebProvider>
      </body>
    </html>
  )
}
