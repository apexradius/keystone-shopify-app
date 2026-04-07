import React from 'react'
import {
  Page,
  Layout,
  CalloutCard,
  Text,
  BlockStack,
  List,
} from '@shopify/polaris'
import { useNavigate } from 'react-router-dom'

export default function Connect({ shop }) {
  const navigate = useNavigate()

  return (
    <Page
      title="Connect Your Store to Keystone"
      subtitle={shop ? `Store: ${shop}` : undefined}
      backAction={{ content: 'Dashboard', onAction: () => navigate('/') }}
    >
      <Layout>
        <Layout.AnnotatedSection
          title="How it works"
          description="Keystone is a CRM and sales pipeline tool built for service businesses. When connected to your Shopify store, it syncs your customers, orders, and interactions automatically."
        >
          <BlockStack gap="400">
            <Text variant="bodyMd" as="p">
              Once connected, Keystone will:
            </Text>
            <List type="bullet">
              <List.Item>
                Sync new Shopify customers to your Keystone contact list in real time
              </List.Item>
              <List.Item>
                Create leads automatically when a new order is placed
              </List.Item>
              <List.Item>
                Track the full customer journey from first visit to closed deal
              </List.Item>
              <List.Item>
                Allow your sales team to manage follow-ups, estimates, and interactions
                directly inside Shopify Admin
              </List.Item>
              <List.Item>
                Send webhook notifications for key events (new customers, orders, app uninstalls)
              </List.Item>
            </List>
          </BlockStack>
        </Layout.AnnotatedSection>

        <Layout.AnnotatedSection
          title="Get connected"
          description="Use the options below to connect your store or access your existing Keystone account."
        >
          <BlockStack gap="400">
            <CalloutCard
              title="Already installed?"
              illustration="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              primaryAction={{
                content: 'Open Dashboard',
                onAction: () => navigate('/'),
              }}
            >
              <p>
                If you installed the Apex MCP Bridge via the Shopify App Store,
                your store is already connected to Keystone. Click below to return
                to your dashboard and view your data.
              </p>
            </CalloutCard>

            <CalloutCard
              title="New to Keystone?"
              illustration="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
              primaryAction={{
                content: 'Visit Keystone',
                url: 'https://keystone.apexradius.ai',
                external: true,
              }}
            >
              <p>
                Don't have a Keystone account yet? Visit{' '}
                <strong>keystone.apexradius.ai</strong> to sign up and then
                install this app from the Shopify App Store to link your store.
              </p>
            </CalloutCard>
          </BlockStack>
        </Layout.AnnotatedSection>
      </Layout>
    </Page>
  )
}
