"use client"

import Link from 'next/link'
import Image from 'next/image'

export default function HomePage() {
  return (
    <>
      <style jsx>{`
        @keyframes shiftColors {
          0%, 100% {
            color: #2cd3a7;
          }
          50% {
            color: #55f86b;
          }
        }
        .animate-shiftColors {
          animation: shiftColors 2s infinite alternate;
        }
      `}</style>
      <div className="flex flex-col items-center justify-center h-screen bg-[#313131] text-white">
        <Image
          src="/dollar_icon2.png"
          alt="Logo"
          width={250}
          height={2500}
          className="mb-8"
        />
        <h1 className="text-4xl font-bold mb-4">
          welcome to <span className="animate-shiftColors">monee</span>
        </h1>
        <p className="text-gray-300 mb-8">your new financial partner</p>
        <Link href="/signin">
          <button className="px-6 py-2 bg-[#2cd3a7] text-white rounded-lg hover:bg-[#55f86b]">
            Sign In
          </button>
        </Link>
      </div>
    </>
  )
}
