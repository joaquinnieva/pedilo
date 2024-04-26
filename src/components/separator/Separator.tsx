function Separator({ children }: any) {
  return (
    <div className="w-full px-4">
      <div className="p-2 px-4 rounded-b-lg border-primary-500 border-b-1 border-t-none shadow-sm">
        <h2 className="text-lg text-primary font-medium title-font">{children}</h2>
      </div>
    </div>
  );
}

export default Separator;
