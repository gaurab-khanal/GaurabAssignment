"use client"
import React from 'react'
import WithAuth from '../components/hoc/WithAuth'

const Layout = ({ children }: {children:React.ReactNode}) => {
    return (
        <div>
            {children}
        </div>
    )
}

export default WithAuth(Layout)