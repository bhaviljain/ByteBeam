export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="text-gray-500 mt-2">Page not found!</p>

      <a href="/" className="text-blue-500 mt-4">
        Go back home
      </a>
    </div>
  );
};
