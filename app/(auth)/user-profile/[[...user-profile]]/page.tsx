import { UserProfile } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile',
  description: 'Manage your KanFlow account settings and profile.',
  robots: {
    index: false,
    follow: false
  }
}

function UserProfilePage() {
  return <UserProfile />
}

export default UserProfilePage
