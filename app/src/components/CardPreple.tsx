export default function CardPreple() {
  let listData = [1,2]

  return <>
    {listData.map((i) => (
            <div key={i} className="flex items-center p-3 hover:bg-gray-100 cursor-pointer">
              <div className="relative">
                <img src={`https://i.pravatar.cc/40?img=${i}`} alt="Profile" className="w-12 h-12 rounded-full" />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="font-semibold">ผู้ติดต่อ {i}</h3>
                <p className="text-sm text-gray-500 truncate">ข้อความล่าสุด...</p>
              </div>
              <span className="text-xs text-gray-400">12:30</span>
            </div>
          ))}
    </>
};
