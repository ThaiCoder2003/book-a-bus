import { Search } from 'lucide-react';

export default function RouteSearchBar() {
  return (
    <div className="flex items-center w-full bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden transition duration-300 focus-within:shadow-md focus-within:border-blue-400">
      
      <Search className="w-5 h-5 ml-4 text-gray-400" />
      
      <input
        type="text"
        placeholder="Tìm kiếm theo tên tuyến hoặc thành phố..."

        className="grow px-4 py-3 text-base placeholder-gray-500 text-gray-700 focus:outline-none"
      />
    </div>
  );
}