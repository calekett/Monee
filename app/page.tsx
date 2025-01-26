import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#313131] text-white">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Homepage</h1>
      <p className="text-gray-300 mb-8">Click the button below to sign in.</p>
      <Link href="/signin">
        <button className="px-6 py-2 bg-[#2cd3a7] text-white rounded-lg hover:bg-[#55f86b]">
          Go to Sign In
        </button>
      </Link>
    </div>
  );
}