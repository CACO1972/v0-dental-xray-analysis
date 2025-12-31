import { GlobalLeaderboard } from "@/components/leaderboard"
import { ReferralProgram } from "@/components/referral-program"
import { ZeroCaresLogotype } from "@/components/zero-caries-logo"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <ZeroCaresLogotype />
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8">
          <GlobalLeaderboard />
          <ReferralProgram />
        </div>
      </div>
    </div>
  )
}
