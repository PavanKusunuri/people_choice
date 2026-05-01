import { Helmet } from 'react-helmet-async';

export default function Dashboard() {
  return (
    <>
      <Helmet>
        <title>Dashboard - CineVault</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">My Dashboard</h1>
        <p className="text-gray-400">Dashboard coming soon...</p>
      </div>
    </>
  );
}
