import { createSupabaseServerClient } from '@/lib/supabase'
import { Banner } from '@/components/ui/banner'
import type { PromoBanner as PromoBannerType } from '@/types/index'

export default async function PromoBanner() {
  const supabase = createSupabaseServerClient()
  const { data } = await supabase.from('promo_banner').select('*').single()
  const banner = data as PromoBannerType | null

  if (!banner?.is_active || !banner.message) return null

  return (
    <Banner
      id="brews-lee-promo"
      message={banner.message}
      variant="normal"
    />
  )
}
