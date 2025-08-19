export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800">
      <header className="bg-[#162c64] text-white py-6 shadow-md">
        <div className="max-w-6xl mx-auto px-6">
          <h1 className="text-3xl font-bold">About Volunteer STL</h1>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto px-6 py-12">
        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">The Mission</h2>
          <p className="text-lg leading-relaxed">
            This application was created to help communities organize, promote, and manage local volunteer efforts efficiently.
            Created in the wake of the 2025 St. Louis City tornado, Volunteer STL's core mission is rooted in compassion, empathy, and perseverance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Features</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl shadow text-left">
              <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="px-6 py-3">Feature</th>
                  <th className="px-6 py-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 font-medium">Effort Dashboard</td>
                  <td className="px-6 py-4">Browse and search all active community efforts.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Add New Effort</td>
                  <td className="px-6 py-4">Create your own volunteer effort with full details.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Volunteer Sign-Up</td>
                  <td className="px-6 py-4">Join efforts and track your commitments.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">My Efforts</td>
                  <td className="px-6 py-4">See efforts you've registered for and manage your involvement.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Messaging System</td>
                  <td className="px-6 py-4">Message other users you've made connections with.</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 font-medium">Effort Commenting System</td>
                  <td className="px-6 py-4">Post comments underneath efforts.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <p className="mt-10 text-right italic">Created by Savion James.</p>
      </main>

      <footer className="bg-[#162c64] text-white text-center py-4 mt-10">
        © 2025 Volunteer STL. All rights reserved.
      </footer>
    </div>
  );
}
