'use client'
import { Box, Card, CardBody, Container, Flex, Heading, Image, Input, SimpleGrid, Skeleton, Stack, Text } from "@chakra-ui/react"
import { ConnectWallet, Web3Button, useAddress, useContract, useContractRead } from "@thirdweb-dev/react"
import { ethers } from "ethers"
import type { NextPage } from "next"
import { useState } from "react"
import '../styles/globals.css'


const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS || '';

const Home: NextPage = () => {
  const address = useAddress();

  const {contract} = useContract(contractAddress);

  const { data: totalAdds, isLoading: loadingTotalAdds } = useContractRead(contract, "getTotalAdds");
  const { data: allAdds, isLoading: loadingAllAdds } = useContractRead(contract, "getAdds");

  const [message, setMessage] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");

  const handleMessageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value)
  }

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const handleImageUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrl(event.target.value)
  }
  
  function clearValues() {
    setMessage("");
    setName("");
    setImageUrl("");
  }
  


  return (
    <Container maxW={"1200px"} w={"full"}>
      <Flex justifyContent={"space-between"} alignItems={"center"} py={"20px"} height={"80px"}>
        <Box>
          <Text fontWeight={"bold"}>EtherAds</Text>
        </Box>
        <ConnectWallet />
      </Flex>
      <SimpleGrid columns={2} spacing={10} mt={"40px"}>
        <Box>
          <Card>
            <CardBody>
              <Heading mb={"20px"}>Place your ad here</Heading>
              <Flex direction={"row"}>
                <Text>Total Ads on website: </Text>
                <Skeleton isLoaded={!loadingTotalAdds} width={"20px"} ml={"5px"}>
                  {totalAdds?.toString()}
                </Skeleton>
              </Flex>
              <Text fontSize={"2xl"} py={"10px"}>Name: </Text>
              <Input placeholder="Svetlana" maxLength={16} value={name} onChange={handleNameChange}></Input>
              <Text fontSize={"2xl"} mt={"10px"} py={"10px"}>Message: </Text>
              <Input placeholder="Put ad text here..." maxLength={80} value={message} onChange={handleMessageChange}></Input>
              <Text fontSize={"2xl"} mt={"10px"} py={"10px"}>Image URL: </Text>
              <Input placeholder="https://imagebobmer/image.png" maxLength={160} value={imageUrl} onChange={handleImageUrlChange}></Input>

              <Box mt={"20px"}>
                {address ? (
                  <Web3Button
                  contractAddress = {contractAddress}
                  action={(contract) => {
                    contract.call("placeAdd", [message, name, imageUrl], {value: ethers.utils.parseEther("0.01")})
                  }}
                  onSuccess={() => clearValues()}
                  >{"Place ad for 0.01 ETH"}</Web3Button>
                ) : (
                  <Text>Connect you wallet to interract</Text>
                )}
              </Box>
            </CardBody>
          </Card>
        </Box>
        <Box>
          <Card maxH={"60vh"} overflow={"scroll"}>
            <CardBody>
              <Text fontWeight={"bold"}>Recent Ads:</Text>
              {!loadingAllAdds ? (
                <Box>
                  {allAdds && allAdds.map((ads:any, index:number) => {
                    return (
                      <Card key={index} my={"10px"}>
                        <CardBody>
                          <Text fontSize={"2xl"}>{ads[1]}</Text>
                          <Text>{ads[2]}</Text>
                          <Image src={ads[3]} alt={`ad-${index}`}/>
                        </CardBody>
                      </Card>

                    )
                  }).reverse()}
                </Box>
              ) : (
                <Stack>
                  <Skeleton height={"1000px"} />
                </Stack>
              )}
            </CardBody>
          </Card>
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default Home;
