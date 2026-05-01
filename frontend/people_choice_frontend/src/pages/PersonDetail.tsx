import { Helmet } from 'react-helmet-async';

export default function PersonDetail() {
  return (
    <>
      <Helmet>
        <title>Person Detail - CineVault</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Person Detail</h1>
        <p className="text-gray-400">Person detail page coming soon...</p>
      </div>
    </>
  );
}
