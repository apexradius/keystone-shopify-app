import React from 'react'
import { Page, Spinner, BlockStack, Text } from '@shopify/polaris'

export default function Install() {
  return (
    <Page>
      <BlockStack gap="400" align="center" inlineAlign="center">
        <Spinner accessibilityLabel="Connecting to Keystone" size="large" />
        <Text variant="headingMd" as="h2">
          Connecting to Keystone...
        </Text>
        <Text tone="subdued" variant="bodyMd">
          Please wait while we set up your store connection.
        </Text>
      </BlockStack>
    </Page>
  )
}
