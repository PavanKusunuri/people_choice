import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <>
      <Helmet>
        <title>CineVault - Entertainment Database</title>
        <meta name="description" content="Discover, rate, and review your favorite movies and TV shows" />
        <meta property="og:title" content="CineVault" />
        <meta property="og:description" content="Your premium entertainment database" />
      </Helmet>

      <div className="min-h-screen bg-dark">
        {/* Hero Section */}
        <div className="relative h-96 bg-gradient-to-r from-dark via-dark-surface to-dark flex items-center">
          <div className="max-w-7xl mx-auto px-4 w-full">
            <h1 className="text-5xl font-bold text-gold mb-4">Welcome to CineVault</h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl">
              Your premier entertainment database. Discover millions of movies, TV shows, web series, and more. Rate, review, and build your personal watchlist.
            </p>
            <div className="flex space-x-4">
              <Link to="/browse" className="btn-primary">
                Start Exploring
              </Link>
              <Link to="/search" className="btn-secondary">
                Search Database
              </Link>
            </div>
          </div>
        </div>

        {/* Coming Soon Sections */}
        <div className="max-w-7xl mx-auto px-4 py-16 space-y-12">
          {/* Trending */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Trending Now</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card p-4 h-48 animate-pulse bg-dark-border" />
              ))}
            </div>
          </section>

          {/* Top Rated */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Top Rated</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card p-4 h-48 animate-pulse bg-dark-border" />
              ))}
            </div>
          </section>

          {/* Upcoming */}
          <section>
            <h2 className="text-3xl font-bold mb-6">Coming Soon</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="card p-4 h-48 animate-pulse bg-dark-border" />
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
