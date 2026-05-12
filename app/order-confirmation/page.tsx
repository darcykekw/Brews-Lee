import Link from 'next/link'

export default function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: { id?: string }
}) {
  const orderId = searchParams.id

  return (
    <>      <main className="min-h-screen bg-cream-50 dark:bg-espresso-900 flex items-center justify-center px-4">
        <div className="text-center max-w-sm space-y-6">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
            <svg className="w-8 h-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-semibold text-espresso-900 dark:text-cream-100">
              Order Placed!
            </h1>
            <p className="text-stone-500 dark:text-stone-400 text-sm">
              Your order has been received and is being prepared.
            </p>
          </div>

          {orderId && (
            <div className="bg-white dark:bg-espresso-800 rounded-2xl border border-stone-100 dark:border-espresso-700 p-4 space-y-1">
              <p className="text-xs text-stone-400 dark:text-stone-500 uppercase tracking-wide">Reference Number</p>
              <p className="font-mono text-sm font-semibold text-espresso-900 dark:text-cream-100">
                {orderId.split('-')[0].toUpperCase()}
              </p>
            </div>
          )}

          <div className="flex flex-col gap-3">
            {orderId && (
              <Link
                href={`/orders/${orderId}`}
                className="px-6 py-3 bg-espresso-900 dark:bg-cream-100 text-cream-50 dark:text-espresso-900 font-medium rounded-xl text-sm hover:bg-espresso-700 dark:hover:bg-cream-200 transition-colors"
              >
                Track Your Order
              </Link>
            )}
            <Link
              href="/menu"
              className="px-6 py-3 border border-stone-200 dark:border-espresso-700 text-espresso-800 dark:text-cream-200 font-medium rounded-xl text-sm hover:bg-cream-100 dark:hover:bg-espresso-800 transition-colors"
            >
              Order More
            </Link>
          </div>
        </div>
      </main>
    </>
  )
}
