'use client'

import * as React from 'react'

import { LoadingOverlay, LoadingSpinner } from '@saas-ui/react'
import { useQuery } from '@tanstack/react-query'

import { useWorkspace } from '@app/features/common/hooks/use-workspace'
import { useRouter } from '@app/nextjs'

import { getCurrentUser } from '@api/client'

export const HomePage: React.FC = () => {
  const router = useRouter()

  const { data, isLoading } = useQuery({
    queryKey: ['CurrentUser'],
    queryFn: () => getCurrentUser(),
  })

  const workspace = useWorkspace()

  React.useEffect(() => {
    if (workspace) {
      router.push(`/${workspace}`)
    } else if (!isLoading && data?.currentUser?.organizations?.[0]) {
      router.push(`/${data.currentUser.organizations[0].slug}`)
    } else if (!isLoading) {
      router.push('/getting-started')
    }
  }, [router, isLoading, data, workspace])

  return (
    <LoadingOverlay variant="fullscreen">
      <LoadingSpinner />
    </LoadingOverlay>
  )
}
