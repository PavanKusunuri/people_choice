import { Helmet } from 'react-helmet-async';

export default function Profile() {
  return (
    <>
      <Helmet>
        <title>Profile - CineVault</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Profile</h1>
        <p className="text-gray-400">Profile page coming soon...</p>
      </div>
    </>
  );
}
