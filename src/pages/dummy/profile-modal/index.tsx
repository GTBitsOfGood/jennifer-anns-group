import { ProfileModal } from '@/components/ProfileModal'
import React from 'react'
import { SessionProvider } from "next-auth/react";

function index() {
  return (
    <SessionProvider>
    <ProfileModal />
    </SessionProvider>

  )
}

export default index