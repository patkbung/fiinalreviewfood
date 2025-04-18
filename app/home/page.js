async function getRestaurant() {
    const res = await fetch('http://localhost:3000/api/restaurant', {
        cache: 'no-store',
    });
    return res.json();
}

export default async function home() {
    const restaurant = await getRestaurant();


    return (
        <main className="p-4">
            <div className="w-full h-[90px] bg-white rounded-[19px] shadow p-7 mb-100">
                <h1 className="text-2xl font-bold">Testology</h1>
            </div>

            <h1 className="text-2xl font-bold mb-2">Recommend</h1>
            <ul className="space-y-2">
                {restaurant.map((r) => (
                    <li
                    key={r.id}
                    className="bg-gray-100 p-4 rounded shadow-sm hover:bg-gray-200 flex items-center gap-4"
                  >
                    {/* รูปวงกลม */}
                    <img
                      src={r.image_url}
                      alt={r.name}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  
                    {/* ชื่อร้าน */}
                    <div>
                      <p className="font-semibold text-xl">{r.name}</p>
                    </div>
                  </li>
                  
                ))}
            </ul>
        </main>
    );
}  