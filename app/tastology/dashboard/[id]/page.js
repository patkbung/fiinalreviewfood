async function getUsers() {
    const res = await fetch('http://localhost:3000/api/user', { cache: 'no-store' });
    return res.json();
  }
  
  export default async function dashboardPage() {
    const users = await getUsers();
  
    return (
      <main>
        <h1>all users</h1>
        <ul>
          {users.map((u) => (
            <li key={u.id}>
              <strong>{u.username}</strong> ({u.email})<br />
              <img src={u.avatar_url} alt={u.username} width={50} height={50} />
            </li>
          ))}
        </ul>
      </main>
    );
  }
  