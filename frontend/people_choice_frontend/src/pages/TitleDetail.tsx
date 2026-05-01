import { Helmet } from 'react-helmet-async';

export default function TitleDetail() {
  return (
    <>
      <Helmet>
        <title>Title Detail - CineVault</title>
      </Helmet>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold mb-8">Title Detail</h1>
        <p className="text-gray-400">Title detail page coming soon...</p>
      </div>
    </>
  );
}
