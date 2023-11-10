"use client";

import { Box, Flex, HStack, Text, useDisclosure } from "@chakra-ui/react";

interface Props {
  children: React.ReactNode;
  to: string;
}

const MENU_LIST = [
  { text: "Home", href: "/" },
  { text: "Submit", href: "/submit" },
  { text: "Swap", href: "/lookup" },
];

const NavLink = (props: Props) => {
  const { to, children } = props;

  return (
    <Box as="a" px={2} py={1} rounded={"md"} href={to}>
      {children}
    </Box>
  );
};

export default function Simple() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Box bg="300" px={4}>
        <Flex
          bg="300"
          h={16}
          alignItems={"center"}
          justifyContent={"space-between"}
        >
          <HStack spacing={8} alignItems={"center"}>
            <a href={"/"}>
              <Text color="200" fontFamily="logo" fontSize="4xl">
                {" "}
                ScribbleSwap v0.2{" "}
              </Text>
            </a>
            <HStack
              as={"nav"}
              bg="300"
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {MENU_LIST.map((link) => (
                <NavLink key={link.text} to={link.href}>
                  <Text color="200">{link.text}</Text>
                </NavLink>
              ))}
            </HStack>
          </HStack>
        </Flex>
      </Box>
    </>
  );
}
