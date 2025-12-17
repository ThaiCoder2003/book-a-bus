const data = [
  { id: 1, user: "User A", email: "user.a@example.com", amount: "+200,000 đ", status: "Paid" },
  { id: 2, user: "User B", email: "user.b@example.com", amount: "+150,000 đ", status: "Pending" },
  { id: 3, user: "User C", email: "user.c@example.com", amount: "+300,000 đ", status: "Failed" },
  { id: 4, user: "User D", email: "user.d@example.com", amount: "+200,000 đ", status: "Paid" },
  { id: 5, user: "User E", email: "user.e@example.com", amount: "+300,000 đ", status: "Paid" },
  // THÊM MỤC 6 VÀ 7 VÀO ĐÂY ĐỂ KIỂM TRA CHỨC NĂNG CUỘN
  { id: 6, user: "User F", email: "user.f@example.com", amount: "+100,000 đ", status: "Paid" },
  { id: 7, user: "User G", email: "user.g@example.com", amount: "+50,000 đ", status: "Pending" },
];

export default function TransactionFeed() {
  
  // Chiều cao phải được tính toán để phù hợp với khối Weekly Chart (h-72 là ví dụ)
  // Lớp h-72 cho phép 5-6 mục hiển thị vừa, mục còn lại sẽ bị cuộn.

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border">
      <h3 className="font-semibold mb-4">Recent Transactions</h3>

      {/* CONTAINER CUỘN: Giới hạn chiều cao và cho phép cuộn */}
      <div className={"h-98 overflow-y-auto custom-scrollbar"}> 
        <ul className="space-y-4">
          {data.map((item) => (
            <li key={item.id} className="flex justify-between items-center mb-8">
              
              {/* Khối User Info */}
              <div className="flex items-center space-x-3">
                <div className="bg-gray-200 w-10 h-10 rounded-full flex items-center justify-center font-semibold">
                  {item.user.slice(-1)}
                </div>
                <div>
                  <div className="font-medium">{item.user}</div>
                  <div className="text-sm text-gray-500">{item.email}</div>
                </div>
              </div>

              {/* Khối Amount/Status */}
              <div className="flex flex-col items-end space-y-1">
                <span className="font-semibold ">{item.amount}</span>

                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold 
                    ${
                      item.status === "Paid"
                        ? "bg-green-100 text-green-600"
                        : item.status === "Pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    }
                  `}
                >
                  {item.status}
                </span>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {/* Kết thúc container cuộn */}
    </div>
  );
}