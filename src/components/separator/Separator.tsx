function Separator({ children }: any) {
  return (
    <div className="w-full p-4">
      <div className="p-4 rounded-lg bg-primary">
        <h2 className="text-lg text-gray-200 font-medium title-font">{children}</h2>
      </div>
    </div>
  );
}

export default Separator;
