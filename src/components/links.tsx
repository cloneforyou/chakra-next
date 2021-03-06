import React from 'react'
import NextLink, { LinkProps as NextLinkProps } from 'next/link'
import { useRouter, NextRouter } from 'next/router'
import { PseudoBoxProps } from '@chakra-ui/core/dist/PseudoBox'
import Button, { ButtonProps } from '@chakra-ui/core/dist/Button'
import Icon from '@chakra-ui/core/dist/Icon'
import ChakraLink, {
  LinkProps as ChakraLinkProps,
} from '@chakra-ui/core/dist/Link'

export interface RouteLinkProps
  extends Omit<NextLinkProps, 'as' | 'href'>,
    Omit<ChakraLinkProps, 'as' | 'href'> {
  as?: string
  to: string
}

export const RouteLink: React.FC<RouteLinkProps> = ({
  to,
  as = to,
  children,
  ...props
}) => {
  return (
    <NextLink href={to} passHref as={as}>
      <ChakraLink {...props}>{children}</ChakraLink>
    </NextLink>
  )
}

// --

export interface OutgoingLinkProps extends ChakraLinkProps {
  showExternalIcon?: boolean
}

export const OutgoingLink: React.FC<OutgoingLinkProps> = ({
  children,
  isExternal = true,
  showExternalIcon = false,
  ...props
}) => {
  return (
    <ChakraLink isExternal={isExternal} {...props}>
      {children}
      {showExternalIcon && (
        <Icon
          name="external-link"
          mx="2px"
          aria-label="(external link)"
          mt="-0.25em"
          fontSize="0.8em"
        />
      )}
    </ChakraLink>
  )
}

// --

export interface ButtonRouteLinkProps
  extends Omit<NextLinkProps, 'as' | 'href'>,
    ButtonProps {
  to: string
}

export const ButtonRouteLink: React.FC<ButtonRouteLinkProps> = ({
  to,
  children,
  ...props
}) => (
  <NextLink href={to} passHref>
    <Button as="a" {...props}>
      {children}
    </Button>
  </NextLink>
)

// --

export interface ShouldBeActiveArgs {
  to: string
  as: string
  router?: NextRouter
}

export type ShouldBeActivePredicate = (args: ShouldBeActiveArgs) => boolean

export interface NavLinkActivePredicates {
  exact: ShouldBeActivePredicate
  startsWith: ShouldBeActivePredicate
}

export const navLinkMatch: NavLinkActivePredicates = {
  exact: ({ as, router }) => router?.asPath === as,
  startsWith: ({ as, router }) => router?.asPath?.startsWith(as) || false,
}

export interface NavLinkProps extends RouteLinkProps {
  active?: Omit<Partial<PseudoBoxProps>, 'as'>
  shouldBeActive?: (args: ShouldBeActiveArgs) => boolean
}

export const NavLink: React.FC<NavLinkProps> = ({
  active: activeProps = {
    textDecoration: 'underline',
  },
  shouldBeActive = navLinkMatch.startsWith,
  to,
  as = to,
  ...props
}) => {
  const router = useRouter()
  router.query
  const active = shouldBeActive({ to, as, router })
  return (
    <RouteLink
      {...(active ? (activeProps as any) : {})}
      as={as}
      to={to}
      {...props}
    />
  )
}
