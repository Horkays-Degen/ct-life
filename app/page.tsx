import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-4 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            CT LIFE
          </h1>
          <p className="text-2xl md:text-3xl text-gray-300 mb-2">
            survive the timeline.
          </p>
          <p className="text-2xl md:text-3xl text-gray-300 mb-2">
            build your bags.
          </p>
          <p className="text-2xl md:text-3xl text-gray-300 mb-8">
            earn your reputation.
          </p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            What would your life look like if Crypto Twitter were an actual world you could live in?
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
            <div className="text-4xl mb-3">🎲</div>
            <h3 className="text-xl font-bold text-white mb-2">Random Origin</h3>
            <p className="text-gray-400 text-sm">
              The timeline decides your starting point. Fresh Wallet? Trust Fund KOL? Let fate decide.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
            <div className="text-4xl mb-3">🌆</div>
            <h3 className="text-xl font-bold text-white mb-2">CT City</h3>
            <p className="text-gray-400 text-sm">
              Explore Timeline Plaza, Degen District, Builder Block, and more in a living crypto world.
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur border border-slate-700 rounded-xl p-6">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="text-xl font-bold text-white mb-2">Three Powers</h3>
            <p className="text-gray-400 text-sm">
              Balance Money, Attention, and Reputation. Maximizing one might sacrifice another.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center space-y-4">
          <Link
            href="/auth"
            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-xl px-12 py-4 rounded-full transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
          >
            ENTER THE TIMELINE
          </Link>
          
          <p className="text-sm text-gray-500">
            No wallet required • Completely fictional currency • Play for free
          </p>
        </div>

        {/* Stats Preview */}
        <div className="mt-16 grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-3xl font-bold text-cyan-400">7</div>
            <div className="text-sm text-gray-400">Origins</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-purple-400">16</div>
            <div className="text-sm text-gray-400">Traits</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-pink-400">8</div>
            <div className="text-sm text-gray-400">Aspirations</div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-xs text-gray-600">
            CT Life uses fictional CT Credits (₵) with no monetary value.
            <br />
            This is a game, not an investment opportunity.
          </p>
        </div>
      </div>
    </div>
  );
}
