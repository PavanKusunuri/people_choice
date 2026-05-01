import { Helmet } from 'react-helmet-async';

export default function Admin() {
  return (
    <>
      <Helmet>
        <title>Admin Panel - CineVault</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Admin Panel</h1>
        <p className="text-gray-400">Admin panel coming soon...</p>
      </div>
    </>
  );
}
