const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500; // zwraca to co zadaliśmy  res.status(400); w userController.js jeżeli nie jest to ustawione to chcemy żeby zwrócił 500 czyli server error
  res.status(statusCode);
  // zwracanie json w zadanej postaci
  res.json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // stack zwraca błędy które sie pojawiły z informacja gdzie. Dlatego potrzebne tylko przy projektowaniu, jak bedzie w produkcji rzestanie je wyświetlać
  });
};

module.exports = { errorHandler };
