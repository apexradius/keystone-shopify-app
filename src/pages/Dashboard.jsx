import React, { useState, useEffect, useCallback } from 'react'
import {
  Page,
  Layout,
  Card,
  Text,
  DataTable,
  EmptyState,
  Button,
  SkeletonBodyText,
  SkeletonDisplayText,
  Banner,
  BlockStack,
  InlineGrid,
} from '@shopify/polaris'
import { useAppBridge } from '@shopify/app-bridge-react'
import { useNavigate } from 'react-router-dom'
import { getKeystoneToken, keystoneApi } from '../api'

export default function Dashboard({ shop }) {
  const app = useAppBridge()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState(null)
  const [stats, setStats] = useState({
    contacts: 0,
    leads: 0,
    openEstimates: 0,
    followUps: 0,
  })
  const [contacts, setContacts] = useState([])
  const [interactions, setInteractions] = useState([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const token = await getKeystoneToken(app)
      keystoneApi.defaults.headers.common['Authorization'] = `Bearer ${token}`

      // Fetch contacts
      const contactsRes = await keystoneApi.get('/api/v1/crm/contacts?limit=10')
      const contactsData = contactsRes.data?.results || contactsRes.data || []
      setContacts(contactsData)

      // Build stats from contacts
      const total = contactsRes.data?.total || contactsData.length || 0
      const leads = contactsData.filter(
        (c) => c.stage === 'lead' || c.stage === 'Lead'
      ).length

      // Try to fetch estimates/follow-ups if endpoints exist
      let openEstimates = 0
      let followUps = 0
      try {
        const estRes = await keystoneApi.get('/api/v1/crm/estimates?status=open&limit=1')
        openEstimates = estRes.data?.total || 0
      } catch (_) {}

      try {
        const fuRes = await keystoneApi.get('/api/v1/crm/follow-ups?status=pending&limit=1')
        followUps = fuRes.data?.total || 0
      } catch (_) {}

      setStats({ contacts: total, leads, openEstimates, followUps })

      // Fetch interactions
      try {
        const intRes = await keystoneApi.get('/api/v1/crm/interactions?limit=10')
        const intData = intRes.data?.results || intRes.data || []
        setInteractions(intData)
      } catch (_) {}

      setConnected(true)
    } catch (err) {
      if (err?.response?.status === 401 || err?.message?.includes('session')) {
        setConnected(false)
      } else {
        setError(err?.response?.data?.detail || err.message || 'Failed to load data')
      }
    } finally {
      setLoading(false)
    }
  }, [app])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const StatCard = ({ title, value, subtitle }) => (
    <Card>
      <BlockStack gap="200">
        <Text variant="headingSm" as="h3" tone="subdued">
          {title}
        </Text>
        {loading ? (
          <SkeletonDisplayText size="large" />
        ) : (
          <Text variant="heading2xl" as="p" fontWeight="bold">
            {value}
          </Text>
        )}
        {subtitle && (
          <Text variant="bodySm" tone="subdued">
            {subtitle}
          </Text>
        )}
      </BlockStack>
    </Card>
  )

  const contactRows = contacts.map((c) => [
    c.name || `${c.first_name || ''} ${c.last_name || ''}`.trim() || '—',
    c.email || '—',
    c.stage || c.status || '—',
    c.source || '—',
    c.created_at ? new Date(c.created_at).toLocaleDateString() : '—',
  ])

  const interactionRows = interactions.map((i) => [
    i.subject || i.title || '—',
    i.type || i.interaction_type || '—',
    i.date || i.created_at
      ? new Date(i.date || i.created_at).toLocaleDateString()
      : '—',
  ])

  if (!loading && !connected) {
    return (
      <Page title="Keystone — Shopify Dashboard">
        <EmptyState
          heading="Connect your store to Keystone"
          action={{
            content: 'Connect Now',
            onAction: () => navigate('/connect'),
          }}
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>
            Link your Shopify store to Keystone CRM to sync customers, manage
            leads, and track your sales pipeline — all from within Shopify Admin.
          </p>
        </EmptyState>
      </Page>
    )
  }

  return (
    <Page
      title="Keystone — Shopify Dashboard"
      subtitle={shop ? `Store: ${shop}` : undefined}
      primaryAction={{
        content: 'Refresh',
        onAction: fetchData,
        loading,
      }}
    >
      <BlockStack gap="600">
        {error && (
          <Banner tone="warning" title="Could not load some data">
            <p>{error}</p>
          </Banner>
        )}

        {/* Stat Cards */}
        <InlineGrid columns={{ xs: 1, sm: 2, md: 4 }} gap="400">
          <StatCard title="Contacts" value={stats.contacts} subtitle="Total in Keystone" />
          <StatCard title="Leads" value={stats.leads} subtitle="Active leads" />
          <StatCard title="Open Estimates" value={stats.openEstimates} subtitle="Awaiting response" />
          <StatCard title="Follow-ups" value={stats.followUps} subtitle="Pending" />
        </InlineGrid>

        {/* Contacts Table */}
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">
                  Recent Contacts
                </Text>
                {loading ? (
                  <SkeletonBodyText lines={5} />
                ) : contactRows.length > 0 ? (
                  <DataTable
                    columnContentTypes={['text', 'text', 'text', 'text', 'text']}
                    headings={['Name', 'Email', 'Stage', 'Source', 'Created']}
                    rows={contactRows}
                  />
                ) : (
                  <Text tone="subdued">No contacts found.</Text>
                )}
              </BlockStack>
            </Card>
          </Layout.Section>
        </Layout>

        {/* Interactions Table */}
        {(loading || interactionRows.length > 0) && (
          <Layout>
            <Layout.Section>
              <Card>
                <BlockStack gap="400">
                  <Text variant="headingMd" as="h2">
                    Recent Interactions
                  </Text>
                  {loading ? (
                    <SkeletonBodyText lines={4} />
                  ) : (
                    <DataTable
                      columnContentTypes={['text', 'text', 'text']}
                      headings={['Subject', 'Type', 'Date']}
                      rows={interactionRows}
                    />
                  )}
                </BlockStack>
              </Card>
            </Layout.Section>
          </Layout>
        )}
      </BlockStack>
    </Page>
  )
}
