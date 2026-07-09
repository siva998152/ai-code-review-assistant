function Card({ children }) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] p-8 w-full max-w-lg">
      {children}
    </div>
  );
}

export default Card;