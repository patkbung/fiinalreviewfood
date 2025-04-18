export default async function DashboardPage({ params }) {
    const res = await fetch('http://localhost:3000/api/user', {
      cache: 'no-store',
    });
    const users = await res.json();
    const user = users.find((u) => Number(u.id) === Number(params.id));
  
    if (!user) {
      return (
        <main className="p-6">
          <h1 className="text-2xl font-bold text-red-600">User not found</h1>
        </main>
      );
    }
  
    return (
      <main className="p-6">
        <h1 className="text-3xl font-bold">{user.username}</h1>
        <p className="text-lg text-gray-700">{user.email}</p>
        <img src={user.avatar_url} alt="Avatar" className="w-32 h-32 rounded-full mt-4" />
      </main>
    );
  }
  