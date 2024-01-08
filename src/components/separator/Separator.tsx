function Separator({ children }: any) {
  return (
    <div className="w-full p-4">
      <div className="border border-gray-200 p-6 rounded-lg">
        <h2 className="text-lg text-gray-200 font-medium title-font mb-2">{children}</h2>
      </div>
    </div>
  );
}

export default Separator;
